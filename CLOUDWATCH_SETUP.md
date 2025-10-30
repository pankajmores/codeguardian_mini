# AWS CloudWatch Integration Guide

This guide explains how to set up and use AWS CloudWatch for monitoring and logging in the CodeGuardian project.

## Overview

AWS CloudWatch provides:
- **Logging**: Centralized application logs
- **Metrics**: Custom metrics for application performance
- **Monitoring**: Real-time insights into your application

## Prerequisites

1. AWS Account
2. AWS Access Key and Secret Access Key
3. IAM permissions for CloudWatch Logs and Metrics

## Environment Variables

Add these to your `.env` files in each service:

### For all services:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
CLOUDWATCH_LOG_GROUP=codeguardian/service-name
CLOUDWATCH_NAMESPACE=CodeGuardian/ServiceName
```

### AI Review Service (.env in ai-review-service/)
```env
SERVICE_NAME=ai-review-service
PORT=5002
GEMINI_API_KEY=your-gemini-key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
CLOUDWATCH_LOG_GROUP=codeguardian/ai-review-service
CLOUDWATCH_NAMESPACE=CodeGuardian/AI-Review
```

### Metrics Service (.env in metrics-service/)
```env
SERVICE_NAME=metrics-service
PORT=5003
DB_HOST=localhost
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=codeguardian_metrics
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
CLOUDWATCH_LOG_GROUP=codeguardian/metrics-service
CLOUDWATCH_NAMESPACE=CodeGuardian/Metrics
```

### Notification Service (.env in notification-service/)
```env
SERVICE_NAME=notification-service
PORT=5004
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
SNS_TOPIC_ARN=your-sns-topic-arn
EMAILJS_SERVICE_ID=your-service-id
EMAILJS_TEMPLATE_ID=your-template-id
EMAILJS_PUBLIC_KEY=your-public-key
S3_BUCKET=your-bucket-name
CLOUDWATCH_LOG_GROUP=codeguardian/notification-service
```

## Installation

### 1. Install Dependencies

```bash
# AI Review Service
cd ai-review-service
npm install aws-sdk

# Metrics Service
cd ../metrics-service
npm install aws-sdk
```

### 2. AWS IAM Permissions

Create an IAM user with the following policy attached:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*"
    }
  ]
}
```

## CloudWatch Features Implemented

### 1. AI Review Service

**Metrics:**
- `code_review_requests` - Total review requests
- `code_review_success` - Successful reviews
- `code_review_failures` - Failed reviews
- `code_review_duration` - Review processing time (ms)

**Logs:**
- All code review operations
- Error messages
- Request completion times

### 2. Metrics Service

**Metrics:**
- `metrics_fetch_requests` - Total fetch requests
- `metrics_fetch_success` - Successful fetches
- `metrics_fetch_failures` - Failed fetches
- `active_developers` - Number of active developers
- `total_commits` - Total commit count

**Database Tracking:**
- Query duration tracking
- Operation success/failure rates

### 3. Notification Service

**Metrics:**
- `notification_requests` - Total notifications
- `notification_success` - Successful notifications
- `notification_failures` - Failed notifications
- `notification_duration` - Notification processing time

## Usage Examples

### View Logs in CloudWatch

1. Go to AWS Console → CloudWatch
2. Navigate to "Log groups"
3. Find your log group (e.g., `codeguardian/ai-review-service`)
4. View real-time logs

### View Metrics

1. Go to CloudWatch → Metrics
2. Navigate to "Custom" namespace
3. Find "CodeGuardian" namespace
4. Select the service you want to monitor

### Create Alarms

You can create CloudWatch alarms for:

**Example Alarm - High Error Rate:**
```
Metric: code_review_failures
Threshold: > 5 in 5 minutes
Action: Send SNS notification
```

**Example Alarm - Slow Processing:**
```
Metric: code_review_duration
Threshold: > 5000ms (5 seconds)
Action: Send email alert
```

## Monitoring Dashboards

### Create Dashboard

1. Go to CloudWatch → Dashboards
2. Create a new dashboard
3. Add widgets for your metrics

### Recommended Widgets

**For AI Review Service:**
- Code Review Requests (Line Chart)
- Code Review Duration (Line Chart)
- Success vs Failure Rate (Number Widget)

**For Metrics Service:**
- Active Developers (Number)
- Total Commits (Line Chart)
- Metrics Fetch Success Rate (Gauge)

## Code Integration

The CloudWatch integration is automatically active in:

- `ai-review-service/controllers/review.controller.js`
- `metrics-service/controllers/metrics.controller.js`
- `notification-service/controllers/notify.controller.js`

### Adding Custom Metrics

```javascript
import cloudwatchLogger from "../services/cloudwatchLogger.js";

// Send a log
await cloudwatchLogger.info('Custom message');

// Send a metric
await cloudwatchLogger.putMetric('custom_metric', 42, 'Count');

// Send a metric with dimensions
await cloudwatchLogger.putMetricWithDimensions(
  'custom_metric',
  42,
  { dimension1: 'value1', dimension2: 'value2' },
  'Count'
);
```

## Troubleshooting

### Issue: Metrics not appearing

**Solution:**
1. Check AWS credentials in .env
2. Verify IAM permissions
3. Check AWS region setting

### Issue: Logs not being created

**Solution:**
1. Verify log group exists in CloudWatch
2. Check CreateLogGroup permission
3. Ensure AWS credentials are valid

### Issue: High costs

**Solution:**
1. Review CloudWatch pricing
2. Set up log retention policies
3. Consider sampling for high-volume logs

## Best Practices

1. **Log Levels**: Use appropriate log levels (INFO, ERROR, WARN, DEBUG)
2. **Metric Naming**: Use consistent naming conventions
3. **Dimensions**: Add meaningful dimensions to metrics
4. **Retention**: Set appropriate log retention periods
5. **Sampling**: Use sampling for high-frequency metrics

## Security

1. **Never commit** `.env` files with AWS credentials
2. Use IAM roles when running on EC2
3. Rotate AWS credentials regularly
4. Use least privilege principle for IAM permissions

## Next Steps

1. Set up CloudWatch alarms for critical metrics
2. Create custom dashboards for monitoring
3. Configure log retention policies
4. Set up automated reports
5. Integrate with AWS X-Ray for distributed tracing

