# Database Setup for Metrics Service

## Quick Setup

### Step 1: Create Database and Tables

```bash
# Run the schema to create database and tables
mysql -u your-username -p < db/schema.sql
```

Or manually in MySQL:

```sql
SOURCE db/schema.sql;
```

### Step 2: Populate with Sample Data

```bash
# Run the seed data
mysql -u your-username -p codeguardian_metrics < db/seed.sql
```

Or manually in MySQL:

```sql
USE codeguardian_metrics;
SOURCE db/seed.sql;
```

### Step 3: Verify Data

```sql
-- Check commits table
SELECT * FROM commits;

-- Check developer metrics
SELECT developer, COUNT(commit_id) AS commits 
FROM commits 
GROUP BY developer;

-- Should show developers like:
-- Alice Johnson: 5 commits
-- Bob Smith: 5 commits
-- Carol Williams: 3 commits
-- etc.
```

## Configuration

Make sure your `.env` file in `metrics-service/` has:

```env
DB_HOST=localhost
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=codeguardian_metrics
PORT=5003
```

## Troubleshooting

### Issue: "Table doesn't exist"
**Solution:** Run the schema.sql file first

### Issue: "Access denied"
**Solution:** Check your MySQL credentials in .env

### Issue: "No data showing"
**Solution:** 
1. Verify database is populated: `SELECT COUNT(*) FROM commits;`
2. Should return 20 rows
3. If 0, run the seed.sql file

### Issue: "Connection refused"
**Solution:**
1. Check if MySQL is running: `mysql --version`
2. Check if database exists: `SHOW DATABASES;`
3. Check if user has permissions

## Testing

After setup, test with:

```bash
# Start the service
cd metrics-service
npm start

# In another terminal
curl http://localhost:5003/api/metrics

# Should return:
# [
#   {"developer": "Alice Johnson", "commits": 5},
#   {"developer": "Bob Smith", "commits": 5},
#   ...
# ]
```

## Adding Your Own Data

To add real commit data, you can insert into the commits table:

```sql
INSERT INTO commits (commit_id, developer, repo, message, url) VALUES
('your-commit-hash', 'Developer Name', 'your-repo', 'Commit message', 'https://github.com/...');
```

## Sample Data Included

The seed.sql file includes:
- 20 sample commits
- 8 different developers
- 3 different repositories
- 3 AI reviews

This gives you realistic metrics to work with!

