import express from "express";
import { reviewCode } from "../controllers/review.controller.js";
const router = express.Router();

router.post("/review", reviewCode);
export default router;
