import express from "express";
import { getMetrics, pushMetric } from "../controllers/metrics.controller.js";

const router = express.Router();

router.get("/metrics", getMetrics);
router.post("/metrics", pushMetric);

export default router;
