import express from "express";
import { receiveNotification, sendEmail, publishSNS } from "../controllers/notify.controller.js";

const router = express.Router();

// Generic notification endpoint (publishes to SNS and optionally sends email)
router.post("/", receiveNotification);

// Explicit endpoints if you want to call directly
router.post("/email", sendEmail);
router.post("/sns", publishSNS);

export default router;
