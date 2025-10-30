import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

// Configure AWS SDK
const cloudwatchlogs = new AWS.CloudWatchLogs({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const LOG_GROUP_NAME = process.env.CLOUDWATCH_LOG_GROUP || 'codeguardian/ai-review-service';
const NAMESPACE = process.env.CLOUDWATCH_NAMESPACE || 'CodeGuardian/AI-Review';

class CloudWatchLogger {
  constructor() {
    this.ensureLogGroup();
  }

  // Ensure log group exists
  async ensureLogGroup() {
    try {
      await cloudwatchlogs.createLogGroup({ logGroupName: LOG_GROUP_NAME }).promise();
    } catch (error) {
      if (error.code !== 'ResourceAlreadyExistsException') {
        console.error('CloudWatch Log Group creation error:', error.message);
      }
    }
  }

  // Send log to CloudWatch
  async log(message, level = 'INFO') {
    try {
      const logStreamName = `${process.env.SERVICE_NAME || 'ai-review'}-${new Date().toISOString().split('T')[0]}`;
      
      const params = {
        logGroupName: LOG_GROUP_NAME,
        logStreamName: logStreamName,
      };

      // Create log stream if it doesn't exist
      try {
        await cloudwatchlogs.createLogStream(params).promise();
      } catch (error) {
        if (error.code !== 'ResourceAlreadyExistsException') {
          throw error;
        }
      }

      // Put log event
      const timestamp = new Date().getTime();
      await cloudwatchlogs.putLogEvents({
        logGroupName: LOG_GROUP_NAME,
        logStreamName: logStreamName,
        logEvents: [{
          message: `[${level}] ${message}`,
          timestamp: timestamp,
        }],
      }).promise();
    } catch (error) {
      console.error('CloudWatch logging error:', error.message);
      // Fall back to console logging
      console.log(`[${level}] ${message}`);
    }
  }

  // Send custom metric to CloudWatch
  async putMetric(metricName, value, unit = 'Count') {
    try {
      const params = {
        Namespace: NAMESPACE,
        MetricData: [
          {
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date(),
          },
        ],
      };

      await cloudwatch.putMetricData(params).promise();
    } catch (error) {
      console.error('CloudWatch metric error:', error.message);
    }
  }

  // Send custom metric with dimensions
  async putMetricWithDimensions(metricName, value, dimensions, unit = 'Count') {
    try {
      const params = {
        Namespace: NAMESPACE,
        MetricData: [
          {
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date(),
            Dimensions: Object.entries(dimensions).map(([Name, Value]) => ({
              Name,
              Value: String(Value),
            })),
          },
        ],
      };

      await cloudwatch.putMetricData(params).promise();
    } catch (error) {
      console.error('CloudWatch metric with dimensions error:', error.message);
    }
  }

  // Helper methods for different log levels
  async info(message) {
    await this.log(message, 'INFO');
  }

  async error(message) {
    await this.log(message, 'ERROR');
  }

  async warn(message) {
    await this.log(message, 'WARN');
  }

  async debug(message) {
    await this.log(message, 'DEBUG');
  }
}

export default new CloudWatchLogger();

