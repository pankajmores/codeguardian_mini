import express from "express";
import { getInsights } from "../controllers/insight.controller.js";
const router = express.Router();
router.get("/insights", getInsights);
export default router;
