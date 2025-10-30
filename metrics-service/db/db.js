import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create the connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
});

// ✅ Test the connection immediately when the service starts
pool.getConnection()
  .then(() => console.log("✅ Connected to AWS RDS successfully!"))
  .catch((err) => console.error("❌ Failed to connect to AWS RDS:", err.message));
