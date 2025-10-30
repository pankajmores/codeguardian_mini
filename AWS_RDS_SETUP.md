# AWS RDS Setup Guide for CodeGuardian

## Overview
If you're using AWS RDS (MySQL) instead of local MySQL, here's how to connect it.

## Step 1: Create/Verify Your RDS Instance

### Option A: Use AWS Console
1. Go to AWS RDS Console
2. Create MySQL instance or use existing
3. Note the endpoint (e.g., `my-db.abc123.us-east-1.rds.amazonaws.com`)

### Option B: Quick RDS Creation Command
```bash
aws rds create-db-instance \
  --db-instance-identifier codeguardian-metrics \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourSecurePassword123 \
  --allocated-storage 20
```

## Step 2: Configure Environment Variables

Create `metrics-service/.env` file:

```env
# AWS RDS Configuration
DB_HOST=your-rds-endpoint.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-secure-password
DB_NAME=codeguardian_metrics
PORT=5003

# Optional: AWS credentials for CloudWatch
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Replace with your actual RDS endpoint and credentials.

## Step 3: Secure Your RDS Instance

### Update Security Group
1. Go to RDS → Your instance → Connectivity & security
2. Click on VPC security groups
3. Edit inbound rules:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: Your IP address (for development)
   - OR use: 0.0.0.0/0 (not recommended for production)

### Important Security Notes:
```env
# For Production, use specific IP:
# Source: your.public.ip.address/32

# For Development only:
# Source: 0.0.0.0/0
```

## Step 4: Set Up the Database

### Option A: Automated Setup (Recommended)

```bash
cd metrics-service
npm run setup-db
```

This will:
- Connect to your RDS database
- Create tables if they don't exist
- Insert sample data

### Option B: Manual Setup

1. Connect to RDS:
```bash
mysql -h your-rds-endpoint.us-east-1.rds.amazonaws.com \
      -u admin -p \
      -P 3306
```

2. Run schema:
```sql
SOURCE metrics-service/db/schema.sql;
```

3. Add data:
```sql
SOURCE metrics-service/db/seed.sql;
```

## Step 5: Start the Service

```bash
cd metrics-service
npm start
```

You should see:
```
✓ Connected to MySQL
Fetched X developer records
📊 Metrics Service on 5003
```

## Step 6: Test the Connection

### Test the API:
```bash
curl http://localhost:5003/api/metrics
```

Should return:
```json
[
  {"developer": "Alice Johnson", "commits": 5},
  {"developer": "Bob Smith", "commits": 5},
  ...
]
```

### Test in Browser:
1. Start frontend: `cd frontend/ui_codeai && npm run dev`
2. Go to Dashboard or Metrics tab
3. You should see data!

## Troubleshooting

### Issue: "Can't connect to MySQL server"
**Solutions:**
1. Check security group allows your IP
2. Verify endpoint is correct
3. Check username/password in .env
4. Ensure RDS is running (check AWS Console)

### Issue: "Access denied"
**Solutions:**
1. Check username is correct (usually 'admin' or 'root')
2. Verify password is correct
3. Check user has permissions

### Issue: "Unknown database"
**Solutions:**
Run setup-db to create database:
```bash
cd metrics-service
npm run setup-db
```

### Issue: "Table doesn't exist"
**Solutions:**
The schema will auto-create tables when you run:
```bash
npm run setup-db
```

## Verify Connection

```bash
# Test connection
mysql -h your-rds-endpoint.us-east-1.rds.amazonaws.com \
      -u admin -p \
      -e "SELECT 1;"

# Check database
mysql -h your-rds-endpoint.us-east-1.rds.amazonaws.com \
      -u admin -p \
      -e "SHOW DATABASES;"

# Check data
mysql -h your-rds-endpoint.us-east-1.rds.amazonaws.com \
      -u admin -p \
      codeguardian_metrics \
      -e "SELECT * FROM commits LIMIT 5;"
```

## Environment Variables Check

Make sure your `.env` file has:

```bash
# Check if file exists
ls -la metrics-service/.env

# View contents (replace with your values)
cat metrics-service/.env

# Should see:
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=codeguardian_metrics
```

## Cost Optimization

For development:
- Use `db.t3.micro` instance class
- Stop instance when not in use
- Use RDS Free Tier if eligible
- Estimated cost: ~$15-20/month if running 24/7

To stop instance when not in use:
```bash
# Stop
aws rds stop-db-instance --db-instance-identifier codeguardian-metrics

# Start
aws rds start-db-instance --db-instance-identifier codeguardian-metrics
```

## Next Steps

Once connected:
1. ✅ Database connected to AWS RDS
2. ✅ Tables created
3. ✅ Sample data inserted
4. ✅ Service running on port 5003
5. ✅ Frontend showing metrics

## Need Help?

Check logs in:
```bash
# Service logs
cd metrics-service && npm start

# Look for:
# ✓ Connected to MySQL
# Fetched X developer records
```

If you see errors, check:
1. Security group rules
2. Endpoint/credentials
3. RDS instance status in AWS Console

