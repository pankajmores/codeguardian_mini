# AWS CloudWatch Integration Summary

## ✅ What's Been Implemented

### 1. **CloudWatch Service Modules**

#### AI Review Service
- Created: `ai-review-service/services/cloudwatchLogger.js`
- Features:
  - Automatic log group creation
  - Automatic log stream management
  - Support for all log levels (INFO, ERROR, WARN, DEBUG)
  - Custom metrics with dimensions
  - Duration tracking

#### Metrics Service  
- Created: `metrics-service/services/cloudwatchMetrics.js`
- Features:
  - Database query tracking
  - Developer activity metrics
  - Custom metrics support
  - CloudWatch logging

### 2. **Controller Updates**

#### AI Review Service Controller
- ✅ Tracks code review requests
- ✅ Measures processing duration
- ✅ Logs all operations
- ✅ Metrics: requests, success, failures, duration

#### Metrics Service Controller  
- ✅ Tracks database queries
- ✅ Measures query performance
- ✅ Tracks developer counts
- ✅ Metrics: fetch requests, success, failures, active_developers, total_commits

#### Notification Service Controller
- ✅ Tracks notification requests
- ✅ Measures notification processing time
- ✅ Metrics: requests, success, failures, duration

## 📊 Metrics Being Tracked

### AI Review Service
| Metric Name | Description | Unit |
|------------|-------------|------|
| code_review_requests | Total review requests | Count |
| code_review_success | Successful reviews | Count |
| code_review_failures | Failed reviews | Count |
| code_review_duration | Processing time | Milliseconds |

### Metrics Service
| Metric Name | Description | Unit |
|------------|-------------|------|
| metrics_fetch_requests | Total fetch requests | Count |
| metrics_fetch_success | Successful fetches | Count |
| metrics_fetch_failures | Failed fetches | Count |
| active_developers | Number of developers | Count |
| total_commits | Total commits | Count |
| get_metrics_duration | Query duration | Milliseconds |

### Notification Service
| Metric Name | Description | Unit |
|------------|-------------|------|
| notification_requests | Total notifications | Count |
| notification_success | Successful notifications | Count |
| notification_failures | Failed notifications | Count |
| notification_duration | Processing time | Milliseconds |

## 🔧 Installation Steps

### Step 1: Install Dependencies

```bash
# Install AWS SDK in AI Review Service
cd ai-review-service
npm install aws-sdk@^2.1692.0

# Install AWS SDK in Metrics Service  
cd ../metrics-service
npm install aws-sdk@^2.1692.0
```

The notification-service already has `aws-sdk` installed.

### Step 2: Configure Environment Variables

#### AI Review Service (.env in ai-review-service/)

```env
PORT=5002
GEMINI_API_KEY=your-gemini-api-key

# AWS CloudWatch Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
SERVICE_NAME=ai-review-service
CLOUDWATCH_LOG_GROUP=codeguardian/ai-review-service
CLOUDWATCH_NAMESPACE=CodeGuardian/AI-Review
```

#### Metrics Service (.env in metrics-service/)

```env
PORT=5003

# Database Configuration
DB_HOST=localhost
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=codeguardian_metrics

# AWS CloudWatch Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDWATCH_LOG_GROUP=codeguardian/metrics-service
CLOUDWATCH_NAMESPACE=CodeGuardian/Metrics
```

#### Notification Service (.env in notification-service/)

```env
PORT=5004

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
SNS_TOPIC_ARN=arn:aws:sns:region:account:topic-name

# Email Configuration (Optional)
EMAILJS_SERVICE_ID=your-service-id
EMAILJS_TEMPLATE_ID=your-template-id
EMAILJS_PUBLIC_KEY=your-public-key

# S3 Configuration (Optional)
S3_BUCKET=your-bucket-name
```

## 🔐 AWS Setup

### Create IAM User with CloudWatch Permissions

1. Go to AWS Console → IAM → Users → Add User
2. Create user with programmatic access
3. Attach the following policy:

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
        "cloudwatch:PutMetricData",
        "logs:DescribeLogStreams"
      ],
      "Resource": "*"
    }
  ]
}
```

4. Save the Access Key ID and Secret Access Key

## 📈 Viewing Your Metrics

### In AWS Console:

1. **CloudWatch Metrics:**
   - Navigate to: CloudWatch → Metrics → All metrics
   - Find namespace: `CodeGuardian`
   - Select your service metrics

2. **CloudWatch Logs:**
   - Navigate to: CloudWatch → Log groups
   - Find your log group (e.g., `codeguardian/ai-review-service`)
   - View real-time logs

3. **Create Dashboards:**
   - Navigate to: CloudWatch → Dashboards → Create dashboard
   - Add widgets for your metrics

## 🚨 Setting Up Alarms

### Example: High Error Rate Alarm

1. Go to CloudWatch → Alarms → Create alarm
2. Select metric: `code_review_failures`
3. Set condition:
   - Threshold: > 5
   - Period: 5 minutes
4. Configure action: Send notification to SNS topic
5. Create alarm

### Example: Slow Processing Alarm

1. Go to CloudWatch → Alarms → Create alarm  
2. Select metric: `code_review_duration`
3. Set condition:
   - Threshold: > 5000ms
   - Period: 5 minutes
4. Configure action: Send email notification
5. Create alarm

## 💰 Cost Optimization

CloudWatch pricing considerations:

- **Logs**: $0.50/GB ingested, $0.03/GB/month stored
- **Custom Metrics**: First 10,000 metrics free, then $0.30/metric
- **Dashboard**: $3.00/dashboard/month

**Tips to reduce costs:**
1. Set log retention to 7-14 days (not indefinite)
2. Use sampling for high-frequency metrics
3. Aggregate multiple metrics into single data point
4. Delete old log streams regularly

## 🧪 Testing the Integration

### Test AI Review Service:

```bash
cd ai-review-service
npm start
```

In another terminal:
```bash
curl -X POST http://localhost:5002/api/review \
  -H "Content-Type: application/json" \
  -d '{"codeSnippet": "function test() { return 1; }"}'
```

Check CloudWatch for logs and metrics.

### Test Metrics Service:

```bash
cd metrics-service
npm start
```

In another terminal:
```bash
curl http://localhost:5003/api/metrics
```

Check CloudWatch for database metrics.

## 📝 Next Steps

1. ✅ CloudWatch integration is complete
2. 🔲 Set up CloudWatch alarms for critical metrics
3. 🔲 Create custom dashboards for monitoring
4. 🔲 Configure log retention policies
5. 🔲 Set up automated weekly reports
6. 🔲 Integrate with AWS X-Ray for distributed tracing

## 📚 Additional Resources

- [AWS CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)
- [CloudWatch Logs Best Practices](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)

