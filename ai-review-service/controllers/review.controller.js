import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cloudwatchLogger from "../services/cloudwatchLogger.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const reviewCode = async (req, res) => {
  const startTime = Date.now();
  const { codeSnippet, files, repo, commit_id } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🧠 Support both single codeSnippet & commit payload
    let prompt = "";

    if (files && Array.isArray(files)) {
      const filesText = files
        .map(f => `File: ${f.path}\n${f.diff?.slice(0, 2000) || ""}`)
        .join("\n\n");

      prompt = `You are CodeGuardian reviewing a commit in repo "${repo}" (commit ${commit_id}). 
Summarize main changes, detect issues (bugs, security, style), and give suggestions:\n\n${filesText}`;
    } else if (codeSnippet) {
      prompt = `Review this code for bugs, security issues, and improvements:\n\n${codeSnippet}`;
    } else {
      return res.status(400).json({ error: "No code provided" });
    }

    // ✅ Run Gemini review
    const result = await model.generateContent(prompt);

    const duration = Date.now() - startTime;
    await cloudwatchLogger.putMetric("code_review_duration", duration, "Milliseconds");
    await cloudwatchLogger.putMetric("code_review_success", 1);

    res.json({
      review: result.response.text(),
      source: "gemini",
      duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await cloudwatchLogger.error(`Code review failed: ${error.message}`);
    await cloudwatchLogger.putMetric("code_review_failures", 1);
    await cloudwatchLogger.putMetric("code_review_duration", duration, "Milliseconds");

    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to review code" });
  }
};
