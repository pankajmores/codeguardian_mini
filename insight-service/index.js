import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import insightRoutes from "./routes/insight.routes.js";
import client from "prom-client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- PROMETHEUS SETUP ---
const register = new client.Registry();
client.collectDefaultMetrics({
  app: "insight_service",
  prefix: "insight_service_",
  register,
});
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// -------------------------

app.use("/api", insightRoutes);

app.get("/", (req, res) => res.send("📊 Insight Service running..."));
app.get("/health", (req, res) =>
  res.json({ status: "healthy", service: "insight-service" })
);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
  console.log(`📈 Insight Service running on port ${PORT}`)
);
