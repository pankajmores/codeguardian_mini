import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple scoring helper
const computeScore = (text) => {
  // Mock simple heuristic: more suggestions -> lower score
  const suggestions = (text.match(/Suggestion:|Issue:|Warning:/gi) || []).length;
  return Math.max(0, 100 - suggestions * 5);
};

export const runAIReview = async (payload) => {
  // Build prompt from payload: include file diffs but keep it short
  const filesText = payload.files.map(f => `File: ${f.path}\n${f.diff.slice(0, 2000)}`).join("\n\n");

  const prompt = `You are CodeGuardian: give a short review for repo ${payload.repo} commit ${payload.commit_id}. 
Provide: summary, issues (security/perf/style), suggestions (bullet list). Only include findings, and keep short. 
Context:\n${filesText}`;

  // Use Gemini API
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    const score = computeScore(content);
    return { content, score, source: "gemini" };
  } catch (err) {
    console.error("Gemini API error:", err.message);
    
    // MOCK response fallback
    const mockContent = `Summary: Minor issues in ${payload.files.length} file(s).\nIssues: possible XSS in user input, long synchronous loops.\nSuggestion: Use parameterized queries; split heavy loops into workers.`;
    const score = computeScore(mockContent);
    return { content: mockContent, score, source: "mock" };
  }
};
