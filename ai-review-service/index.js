import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiReviewRoutes from "./routes/aiReview.routes.js";
import client from "prom-client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- PROMETHEUS SETUP ---
const register = new client.Registry();
client.collectDefaultMetrics({
  app: "ai_review_service",
  prefix: "ai_review_service_",
  register,
});
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// -------------------------

app.use("/api", aiReviewRoutes);

app.get("/", (_, res) => res.send("🤖 AI Review Service running..."));
app.get("/health", (_, res) =>
  res.json({ status: "healthy", service: "ai-review-service" })
);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🤖 AI Review Service running on port ${PORT}`));
