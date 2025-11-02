import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import repoRoutes from "./routes/repo.routes.js";
import { initDB } from "./services/db.js";
import client from "prom-client";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- PROMETHEUS SETUP ---
const register = new client.Registry();
client.collectDefaultMetrics({
  app: "repo_service",
  prefix: "repo_service_",
  register,
});
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
// -------------------------

initDB();
app.use("/api", repoRoutes);

app.get("/", (_, res) => res.send("Repo Service running..."));
app.get("/health", (_, res) =>
  res.json({ status: "healthy", service: "repo-service" })
);

app.listen(process.env.PORT || 5001, () =>
  console.log(`🚀 Repo Service on ${process.env.PORT || 5001}`)
);
