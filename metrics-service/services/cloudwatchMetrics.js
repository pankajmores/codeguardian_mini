import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cloudwatchlogs = new AWS.CloudWatchLogs({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const LOG_GROUP_NAME = process.env.CLOUDWATCH_LOG_GROUP || 'codeguardian/metrics-service';
const NAMESPACE = process.env.CLOUDWATCH_NAMESPACE || 'CodeGuardian/Metrics';

class CloudWatchMetrics {
  // Send custom metric
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

  // Send metric for database query
  async trackDatabaseQuery(operation, duration) {
    await this.putMetric(`${operation}_duration`, duration, 'Milliseconds');
    await this.putMetric(`${operation}_count`, 1);
  }

  // Track developer metrics
  async trackDeveloperActivity(developerCount, totalCommits) {
    await this.putMetric('active_developers', developerCount);
    await this.putMetric('total_commits', totalCommits);
  }

  // Log to CloudWatch
  async log(message, level = 'INFO') {
    try {
      const logStreamName = `metrics-${new Date().toISOString().split('T')[0]}`;
      
      try {
        await cloudwatchlogs.createLogGroup({ logGroupName: LOG_GROUP_NAME }).promise();
      } catch (error) {
        if (error.code !== 'ResourceAlreadyExistsException') {
          throw error;
        }
      }

      try {
        await cloudwatchlogs.createLogStream({
          logGroupName: LOG_GROUP_NAME,
          logStreamName: logStreamName,
        }).promise();
      } catch (error) {
        if (error.code !== 'ResourceAlreadyExistsException') {
          throw error;
        }
      }

      await cloudwatchlogs.putLogEvents({
        logGroupName: LOG_GROUP_NAME,
        logStreamName: logStreamName,
        logEvents: [{
          message: `[${level}] ${message}`,
          timestamp: new Date().getTime(),
        }],
      }).promise();
    } catch (error) {
      console.error('CloudWatch logging error:', error.message);
      console.log(`[${level}] ${message}`);
    }
  }
}

export default new CloudWatchMetrics();

