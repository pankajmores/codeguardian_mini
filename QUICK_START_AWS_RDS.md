# Quick Start: Getting Data to Show on Dashboard & Metrics

## Your Setup
✅ AWS RDS connected to project
❌ Database is empty (no data showing)

## Solution: Populate Your AWS RDS Database

### Step 1: Configure Your .env File

Go to `metrics-service/` and create or edit `.env` file:

```env
# AWS RDS Configuration (REPLACE WITH YOUR VALUES)
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=codeguardian_metrics
PORT=5003
```

**Replace with your actual AWS RDS details:**
- `DB_HOST`: Your RDS endpoint from AWS Console
- `DB_USER`: Your RDS username (usually 'admin')
- `DB_PASSWORD`: Your RDS password
- `DB_NAME`: codeguardian_metrics

### Step 2: Run the Setup Script

```bash
cd metrics-service
npm install
npm run setup-db
```

This will:
- Connect to your AWS RDS
- Create tables (if they don't exist)
- Insert 20 sample commits from 8 developers
- Show you the summary

### Step 3: Start the Metrics Service

```bash
# In metrics-service directory
npm start
```

You should see:
```
✓ Connected to MySQL
Fetched X developer records
📊 Metrics Service on 5003
```

### Step 4: Start Your Frontend

```bash
# In a new terminal
cd frontend/ui_codeai
npm run dev
```

### Step 5: View Your Data

1. Open browser to `http://localhost:5173`
2. Go to **Dashboard** tab → Should show developer stats
3. Go to **Metrics** tab → Should show commit activity with progress bars

## What Data Will Show

After running `npm run setup-db`, you'll have:
- **8 Developers**: Alice Johnson, Bob Smith, Carol Williams, David Brown, Emily Davis, Frank Miller, Grace Wilson
- **20 Commits** with various metrics
- Developer activity with commit counts

## Verification

### Check API Directly:
```bash
curl http://localhost:5003/api/metrics
```

Should return:
```json
[
  {"developer": "Alice Johnson", "commits": 5},
  {"developer": "Bob Smith", "commits": 5},
  {"developer": "Carol Williams", "commits": 3},
  {"developer": "David Brown", "commits": 2},
  {"developer": "Emily Davis", "commits": 1},
  {"developer": "Frank Miller", "commits": 1},
  {"developer": "Grace Wilson", "commits": 1}
]
```

### Check in MySQL:
```sql
SELECT developer, COUNT(*) as commits 
FROM commits 
GROUP BY developer;
```

## Troubleshooting

### "Can't connect to MySQL server"
**Fix:**
1. Check security group in AWS RDS allows port 3306
2. Check your IP is allowed
3. Verify endpoint in .env is correct

### "Access denied"
**Fix:**
1. Check username/password in .env
2. Make sure user has permissions on database

### "Unknown database"
**Fix:**
```bash
# Run setup again
cd metrics-service
npm run setup-db
```

### "Empty data"
**Fix:**
```bash
# Check if seed was inserted
mysql -h your-host -u admin -p codeguardian_metrics -e "SELECT COUNT(*) FROM commits;"

# If count is 0, run seed manually
mysql -h your-host -u admin -p codeguardian_metrics < db/seed.sql
```

## Expected Result

Once everything is working, you'll see:

### Dashboard Tab:
- **Total Reviews**: 20
- **Active Developers**: 8
- **Total Commits**: 20

### Metrics Tab:
- **Active Developers Card**: 8
- **Total Commits Card**: 20
- **Avg Commits/Dev**: 2.5
- **Developer List**: All 8 developers with their commit counts and progress bars

## Still Having Issues?

1. **Check RDS Security Group:**
   - Go to AWS Console → RDS → Your instance
   - Check Security Group → Inbound Rules
   - Should allow MySQL (3306) from your IP

2. **Check Service Logs:**
   ```bash
   cd metrics-service
   npm start
   ```
   Look for: "Fetched X developer records"

3. **Test Connection:**
   ```bash
   mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p
   ```

4. **Verify Data Exists:**
   ```sql
   USE codeguardian_metrics;
   SELECT COUNT(*) FROM commits;
   -- Should return 20
   ```

## Next Steps

Once you see data on your frontend:
1. ✅ Dashboard showing metrics
2. ✅ Metrics tab showing developers
3. You can now add your own real data to the database
4. Consider setting up CloudWatch for monitoring (optional)

