import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import metricsRoutes from "./routes/metrics.routes.js";
import client from "prom-client";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- PROMETHEUS SETUP ---
const register = new client.Registry();
client.collectDefaultMetrics({
  app: "metrics_service",
  prefix: "metrics_service_",
  register,
});
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// -------------------------

app.use("/api", metricsRoutes);

app.get("/", (_, res) => res.send("📊 Metrics Service running..."));
app.get("/health", (_, res) =>
  res.json({ status: "healthy", service: "metrics-service" })
);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`✅ Metrics Service running on port ${PORT}`));
