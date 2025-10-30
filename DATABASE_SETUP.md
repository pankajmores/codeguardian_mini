# Database Setup Guide for CodeGuardian

## Problem: No Metrics Showing

Your database is connected but empty. You need to populate it with data.

## Quick Fix (5 minutes)

### Option 1: Using MySQL Command Line

```bash
# Navigate to metrics-service
cd metrics-service

# Create database and tables
mysql -u root -p < db/schema.sql

# Add sample data
mysql -u root -p < db/seed.sql
```

### Option 2: Using MySQL Workbench or phpMyAdmin

1. **Create Database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS codeguardian_metrics;
   USE codeguardian_metrics;
   ```

2. **Run Schema:**
   - Copy contents of `metrics-service/db/schema.sql`
   - Paste and execute in MySQL

3. **Add Sample Data:**
   - Copy contents of `metrics-service/db/seed.sql`
   - Paste and execute in MySQL

### Verify Setup

```sql
-- Check if data exists
SELECT COUNT(*) FROM commits;
-- Should show 20

-- Check developer metrics
SELECT developer, COUNT(*) as commits 
FROM commits 
GROUP BY developer;
-- Should show 8 developers with various commit counts
```

## Environment Variables

Make sure `metrics-service/.env` has:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=codeguardian_metrics
PORT=5003
```

## Restart the Service

```bash
cd metrics-service
npm start
```

## Test the API

```bash
curl http://localhost:5003/api/metrics
```

You should see:
```json
[
  {"developer": "Alice Johnson", "commits": 5},
  {"developer": "Bob Smith", "commits": 5},
  {"developer": "Carol Williams", "commits": 3},
  ...
]
```

## What the Sample Data Includes

- **8 Developers:** Alice Johnson, Bob Smith, Carol Williams, David Brown, Emily Davis, Frank Miller, Grace Wilson
- **20 Commits** across different repositories
- **3 AI Reviews** with scores
- **Various commit messages** and dates

## After Populating

Once you have data:
1. Refresh your frontend
2. Go to Metrics tab
3. You should see developer statistics with progress bars

## Still Not Working?

1. **Check MySQL is running:**
   ```bash
   mysql --version
   ```

2. **Check database exists:**
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

3. **Check service logs:**
   - Look at the terminal where metrics-service is running
   - Should see "Fetched X developer records"

4. **Test the endpoint directly:**
   ```bash
   curl http://localhost:5003/api/metrics
   ```

## Need Help?

- Check `metrics-service/db/SETUP.md` for detailed instructions
- Make sure your MySQL credentials are correct in `.env`
- Verify database name is exactly: `codeguardian_metrics`

