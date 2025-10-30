import { pool } from "../db/db.js";
import cloudwatchMetrics from "../services/cloudwatchMetrics.js";

export const getMetrics = async (_, res) => {
  const startTime = Date.now();

  try { 
    const [rows] = await pool.query(`
      SELECT author AS developer, COUNT(sha) AS commits 
FROM Commits 
GROUP BY author;

    `);

    // CloudWatch tracking (optional)
    if (cloudwatchMetrics) {
      try {
        await cloudwatchMetrics.putMetric("metrics_fetch_success", 1);
      } catch (e) {
        console.log("CloudWatch logging skipped:", e.message);
      }
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ Metrics fetch error:", err);
    res.status(500).json({ error: "Metrics fetch failed", details: err.message });
  }
};

export const pushMetric = async (req, res) => {
  const { developer, commit_id } = req.body;

  if (!developer || !commit_id) {
    return res.status(400).json({ error: "developer and commit_id required" });
  }

  try {
    await pool.query(`INSERT INTO commits (developer, commit_id) VALUES (?, ?)`, [developer, commit_id]);
    res.status(201).json({ message: "Metric inserted successfully" });
  } catch (err) {
    console.error("❌ Failed to insert metric:", err);
    res.status(500).json({ error: "Failed to insert metric", details: err.message });
  }
};
