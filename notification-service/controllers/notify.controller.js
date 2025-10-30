import AWS from "aws-sdk";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// CloudWatch setup for monitoring
const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// AWS clients (v2 SDK)
const sns = new AWS.SNS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Send email via EmailJS REST API
export const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    const resp = await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: { to, subject, message },
    }, { headers: { "Content-Type": "application/json" } });

    if (resp.status >= 200 && resp.status < 300) {
      return res.json({ success: true });
    }
    return res.status(502).json({ error: "EmailJS error" });
  } catch (error) {
    return res.status(500).json({ error: "Email sending failed" });
  }
};

// Publish a notification to SNS topic
export const publishSNS = async (req, res) => {
  const { subject, message, attributes } = req.body;
  try {
    const result = await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: subject || "CodeGuardian Notification",
      Message: typeof message === "string" ? message : JSON.stringify(message),
      MessageAttributes: Object.entries(attributes || {}).reduce((acc, [k, v]) => {
        acc[k] = { DataType: "String", StringValue: String(v) };
        return acc;
      }, {}),
    }).promise();
    return res.json({ success: true, MessageId: result.MessageId });
  } catch (error) {
    return res.status(500).json({ error: "SNS publish failed" });
  }
};

// Optional: store payloads or reports to S3
export const uploadToS3 = async (req, res) => {
  const { filename, content } = req.body;
  try {
    const result = await s3.upload({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
      Body: typeof content === "string" ? content : JSON.stringify(content),
      ContentType: "application/json",
    }).promise();
    return res.json({ success: true, url: result.Location });
  } catch (error) {
    return res.status(500).json({ error: "Upload failed" });
  }
};

// Send metric to CloudWatch
const putMetric = async (metricName, value, unit = 'Count') => {
  try {
    await cloudwatch.putMetricData({
      Namespace: 'CodeGuardian/Notifications',
      MetricData: [{
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
      }],
    }).promise();
  } catch (error) {
    console.error('CloudWatch metric error:', error.message);
  }
};

// Unified handler: publish to SNS and send email if requested
export const receiveNotification = async (req, res) => {
  const startTime = Date.now();
  const { to, subject, message, attributes, s3Data } = req.body || {};
  
  try {
    await putMetric('notification_requests', 1);
    // Publish event to SNS
    if (process.env.SNS_TOPIC_ARN) {
      await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: subject || "CodeGuardian Notification",
        Message: typeof message === "string" ? message : JSON.stringify(message),
        MessageAttributes: Object.entries(attributes || {}).reduce((acc, [k, v]) => {
          acc[k] = { DataType: "String", StringValue: String(v) };
          return acc;
        }, {}),
      }).promise();
    }

    // Optionally send email
    if (to && process.env.EMAILJS_SERVICE_ID) {
      await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: { to, subject, message },
      }, { headers: { "Content-Type": "application/json" } });
    }

    // Optionally store to S3
    if (s3Data?.filename && s3Data?.content && process.env.S3_BUCKET) {
      await s3.upload({
        Bucket: process.env.S3_BUCKET,
        Key: s3Data.filename,
        Body: typeof s3Data.content === "string" ? s3Data.content : JSON.stringify(s3Data.content),
        ContentType: "application/json",
      }).promise();
    }

    const duration = Date.now() - startTime;
    await putMetric('notification_success', 1);
    await putMetric('notification_duration', duration, 'Milliseconds');
    
    return res.json({ success: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    await putMetric('notification_failures', 1);
    await putMetric('notification_duration', duration, 'Milliseconds');
    
    console.error("Notification error:", error.message);
    return res.status(500).json({ error: "Notification handling failed" });
  }
};
