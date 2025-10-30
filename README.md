# CodeGuardian 🛡️

**CodeGuardian** is an intelligent DevOps assistant designed to automate code reviews, analyze developer productivity, and enhance overall software quality. It integrates directly with GitHub repositories to fetch commits and pull requests, uses AI (Google Gemini) to evaluate code quality, and sends notifications through AWS SNS and EmailJS.

---

## 🏗️ Architecture

CodeGuardian consists of 5 microservices:

### 1. **Repo Service** (Port 5001)
- Fetches commits, branches, and PRs from GitHub API
- **Endpoints:** `/api/repos`, `/api/commits`, `/api/pulls`

### 2. **AI Review Service** (Port 5002)
- Analyzes code diffs using Google Gemini API
- Detects anti-patterns, security issues, and provides suggestions
- **Endpoints:** `/api/review`, `/api/suggest`

### 3. **Metrics Service** (Port 5003)
- Stores and calculates developer metrics (commits per user, PR stats, review scores)
- Uses MySQL database
- **Endpoints:** `/api/metrics`, `/api/stats/team`

### 4. **Notification Service** (Port 5004)
- Sends notifications via AWS SNS and EmailJS
- Stores reports in AWS S3
- **Endpoints:** `/notify/email`, `/notify/sns`, `/notify/s3`

### 5. **Insight Service** (Port 5005)
- Aggregates data from all services
- Provides dashboards: top contributors, code issues, productivity trends
- **Endpoints:** `/api/insights`, `/api/dashboard`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- AWS Account (for SNS, S3, RDS)
- Google Gemini API Key
- GitHub Personal Access Token
- EmailJS Account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd codeguardian
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to each service directory
   cp .env.example repo-service/.env
   cp .env.example ai-review-service/.env
   cp .env.example metrics-service/.env
   cp .env.example notification-service/.env
   cp .env.example insight-service/.env
   
   # Edit each .env file with your credentials
   ```

4. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

5. **Initialize database**
   ```bash
   # The schema will be automatically loaded from metrics-service/db/schema.sql
   # Or manually run:
   docker exec -i codeguardian-mysql mysql -uroot -prootpassword codeguardian_metrics < metrics-service/db/schema.sql
   ```

6. **Test services**
   ```bash
   curl http://localhost:5001/health  # Repo Service
   curl http://localhost:5002/health  # AI Review Service
   curl http://localhost:5003/health  # Metrics Service
   curl http://localhost:5004/health  # Notification Service
   curl http://localhost:5005/health  # Insight Service
   ```

---

## ☁️ AWS Deployment

### Step 1: Setup AWS Infrastructure

#### 1. Create RDS MySQL Instance
```bash
aws rds create-db-instance \
  --db-instance-identifier codeguardian-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-name codeguardian_metrics
```

#### 2. Create SNS Topic
```bash
aws sns create-topic --name CodeGuardianNotifications
```

#### 3. Create S3 Bucket
```bash
aws s3 mb s3://codeguardian-reports --region us-east-1
```

#### 4. Store Secrets in AWS Secrets Manager
```bash
aws secretsmanager create-secret --name codeguardian/github-token --secret-string "YOUR_GITHUB_TOKEN"
aws secretsmanager create-secret --name codeguardian/gemini-api-key --secret-string "YOUR_GEMINI_KEY"
aws secretsmanager create-secret --name codeguardian/db-password --secret-string "YOUR_DB_PASSWORD"
aws secretsmanager create-secret --name codeguardian/emailjs-service-id --secret-string "YOUR_EMAILJS_SERVICE_ID"
aws secretsmanager create-secret --name codeguardian/emailjs-template-id --secret-string "YOUR_EMAILJS_TEMPLATE_ID"
aws secretsmanager create-secret --name codeguardian/emailjs-public-key --secret-string "YOUR_EMAILJS_PUBLIC_KEY"
```

### Step 2: Build and Push Docker Images

```bash
# Set your AWS credentials
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=123456789012

# Run deployment script
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### Step 3: Deploy to ECS

#### 1. Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name codeguardian
```

#### 2. Create CloudWatch Log Group
```bash
aws logs create-log-group --log-group-name /ecs/codeguardian
```

#### 3. Update Task Definition
Edit `aws-ecs-task-definition.json` and replace:
- `YOUR_ACCOUNT_ID` with your AWS account ID
- RDS endpoint in DB_HOST
- Create IAM roles: `ecsTaskExecutionRole` and `CodeGuardianTaskRole`

#### 4. Register Task Definition
```bash
aws ecs register-task-definition --cli-input-json file://aws-ecs-task-definition.json
```

#### 5. Create ECS Service with Load Balancer
```bash
aws ecs create-service \
  --cluster codeguardian \
  --service-name codeguardian-services \
  --task-definition codeguardian-services \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/codeguardian-tg,containerName=repo-service,containerPort=5001"
```

---

## 📊 Database Schema

The MySQL database includes:
- `commits` - Store commit data from GitHub
- `pull_requests` - Track PR information
- `ai_reviews` - AI-generated code review results
- `developer_metrics` - Aggregated view of developer stats
- `team_activity` - Daily team activity tracking

Schema file: `metrics-service/db/schema.sql`

---

## 🔑 Environment Variables

All required environment variables are documented in `.env.example`. Key variables:

- `GITHUB_TOKEN` - GitHub Personal Access Token
- `GEMINI_API_KEY` - Google Gemini API key
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `SNS_TOPIC_ARN` - SNS topic for notifications
- `S3_BUCKET` - S3 bucket for storing reports
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL configuration
- `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` - EmailJS config

---

## 🧪 Testing

```bash
# Test GitHub integration
curl -X GET "http://localhost:5001/api/commits?owner=octocat&repo=Hello-World"

# Test AI code review
curl -X POST http://localhost:5002/api/review \
  -H "Content-Type: application/json" \
  -d '{"codeSnippet": "function add(a,b){return a+b}"}'

# Test metrics
curl http://localhost:5003/api/metrics

# Test notification
curl -X POST http://localhost:5004/notify/email \
  -H "Content-Type: application/json" \
  -d '{"to": "dev@example.com", "subject": "Test", "message": "Hello from CodeGuardian"}'
```

---

## 📦 Useful Commands

```bash
# Install all dependencies
npm run install:all

# Start individual services
npm run start:repo
npm run start:ai
npm run start:metrics
npm run start:notification
npm run start:insight

# Docker commands
npm run docker:build    # Build all images
npm run docker:up       # Start all containers
npm run docker:down     # Stop all containers

# View logs
docker-compose logs -f repo-service
docker-compose logs -f ai-review-service
```

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **AI:** Google Gemini API
- **Database:** MySQL (AWS RDS)
- **Cloud:** AWS (ECS, SNS, S3, RDS, Secrets Manager)
- **Notifications:** AWS SNS, EmailJS
- **Containerization:** Docker, Docker Compose
- **VCS Integration:** GitHub API

---

## 📝 License

ISC

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 🐛 Issues

For bugs and feature requests, please create an issue in the repository.

---

## 📧 Contact

For questions or support, reach out via the repository issues page.
