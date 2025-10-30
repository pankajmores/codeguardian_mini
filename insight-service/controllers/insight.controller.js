import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ...existing code...
const buildCandidates = (fullUrl) => {
  try {
    const u = new URL(fullUrl);
    const base = `${u.protocol}//${u.host}`;
    return [
      fullUrl,
      `${base}/api/review`,
      `${base}/api/reviews`,
      `${base}/review`,
      `${base}/reviews`,
      `${base}/health`,
      `${base}/`
    ];
  } catch {
    return [fullUrl];
  }
};

const fetchWithFallback = async (initialUrl) => {
  const candidates = buildCandidates(initialUrl);
  let lastErr = null;
  for (const url of candidates) {
    try {
      const resp = await axios.get(url);
      console.log(`✔ Fetched ${url} (status ${resp.status})`);
      return resp;
    } catch (err) {
      lastErr = err;
      console.warn(`Attempt failed: ${url} -> ${err.response?.status || err.code || err.message}`);
      // continue to next candidate
    }
  }
  // throw last error for caller to handle
  throw lastErr || new Error("No candidates attempted");
};

export const getInsights = async (_, res) => {
  try {
    console.log("AI_SERVICE_URL:", process.env.AI_SERVICE_URL);
    console.log("METRICS_URL:", process.env.METRICS_URL);

    const [aiResp, metricsResp] = await Promise.all([
      fetchWithFallback(process.env.AI_SERVICE_URL),
      fetchWithFallback(process.env.METRICS_URL)
    ]);

    res.json({
      message: "Aggregated insights generated successfully",
      aiInsights: aiResp.data,
      metrics: metricsResp.data
    });
  } catch (error) {
    // More detailed error output for debugging
    console.error("❌ Insight aggregation failed:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch insights",
      details: error.response?.data || error.message
    });
  }
};
// ...existing code...