import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;

  try {
    console.log('🚀 Setting up CodeGuardian Metrics Database...\n');
    console.log(`Connecting to: ${process.env.DB_HOST || 'localhost'}\n`);

    // Create connection with database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'database-1',
    });

    console.log('✓ Connected to MySQL');

    // Check if table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "commits"');
    
    if (tables.length === 0) {
      // Read and execute schema
      const schemaPath = path.join(__dirname, 'db', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      console.log('✓ Reading schema file...');
      const queries = schema.split(';').filter(q => q.trim());
      
      for (const query of queries) {
        if (query.trim() && !query.includes('CREATE DATABASE') && !query.includes('USE')) {
          await connection.query(query);
        }
      }
      console.log('✓ Tables created\n');
    } else {
      console.log('✓ Tables already exist\n');
    }

    // Check if data already exists
    const [existingCommits] = await connection.query('SELECT COUNT(*) as count FROM commits');
    
    if (existingCommits[0].count === 0) {
      // Read and execute seed data
      const seedPath = path.join(__dirname, 'db', 'seed.sql');
      const seed = fs.readFileSync(seedPath, 'utf8');
      
      console.log('✓ Reading seed data...');
      const seedQueries = seed.split(';').filter(q => q.trim());
      
      for (const query of seedQueries) {
        if (query.trim() && !query.includes('USE')) {
          try {
            await connection.query(query);
          } catch (err) {
            // Skip duplicate key errors
            if (!err.message.includes('Duplicate entry')) {
              throw err;
            }
          }
        }
      }
      console.log('✓ Sample data inserted\n');
    } else {
      console.log('✓ Data already exists, skipping seed\n');
    }

    // Verify data
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'codeguardian_metrics',
    });

    const [commits] = await connection.query('SELECT COUNT(*) as count FROM commits');
    const [developers] = await connection.query(`
      SELECT developer, COUNT(commit_id) AS commits 
      FROM commits 
      GROUP BY developer
    `);

    console.log('📊 Database Summary:');
    console.log(`   Total commits: ${commits[0].count}`);
    console.log(`   Total developers: ${developers.length}\n`);
    console.log('   Developer breakdown:');
    developers.forEach(dev => {
      console.log(`   • ${dev.developer}: ${dev.commits} commits`);
    });

    console.log('\n✅ Database setup complete!');
    console.log('📝 You can now start the metrics service: npm start\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. MySQL is running');
    console.error('   2. Credentials in .env are correct');
    console.error('   3. You have permission to create databases\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

