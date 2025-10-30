import axios from "axios";

const NOTIFY_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5004/notify";

export const notify = async (payload) => {
  try {
    await axios.post(NOTIFY_URL, payload);
  } catch (err) {
    console.error("Failed to notify:", err?.response?.data || err.message);
  }
};
