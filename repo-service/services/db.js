// src/config/db.js
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

// Define Commit model
export const Commit = sequelize.define("Commit", {
  repoName: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  sha: { type: DataTypes.STRING, unique: true },
  date: { type: DataTypes.DATE },
});

// Define Pull Request model
export const Pull = sequelize.define("Pull", {
  repoName: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  author: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE },
});

// Initialize DB connection and sync models
export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to AWS RDS successfully!");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};
