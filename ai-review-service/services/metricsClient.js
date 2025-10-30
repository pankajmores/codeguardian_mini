import axios from "axios";

const METRICS_URL = process.env.METRICS_SERVICE_URL || "http://localhost:5003/metrics";

export const pushMetric = async (metric) => {
  try {
    await axios.post(METRICS_URL, metric);
  } catch (err) {
    console.error("Failed to push metric:", err?.response?.data || err.message);
  }
};
