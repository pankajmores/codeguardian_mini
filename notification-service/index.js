import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import notifyRoutes from "./routes/notify.routes.js";
import client from "prom-client";

const app = express();
const PORT = process.env.PORT || 5004;

// --- PROMETHEUS SETUP ---
const register = new client.Registry();
client.collectDefaultMetrics({
  app: "notification_service",
  prefix: "notification_service_",
  register,
});
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// -------------------------

app.use(cors());
app.use(express.json());
app.use("/notify", notifyRoutes);

app.get("/", (req, res) => res.send("Notification Service running"));
app.get("/health", (_, res) =>
  res.json({ status: "healthy", service: "notification-service" })
);

app.listen(PORT, () => console.log(`📧 Notification Service on ${PORT}`));
