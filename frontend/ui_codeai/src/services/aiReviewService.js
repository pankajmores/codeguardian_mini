import api from "./api.js";

/**
 * AI Review Service - Handles AI-powered code analysis using Gemini
 */
class AIReviewService {
  constructor() {
    this.serviceKey = "AI_REVIEW_SERVICE"; // points to http://localhost:5002/api
  }

  /**
   * Review a small manual code snippet using AI
   * @param {string} codeSnippet - Code text to review
   * @returns {Promise<Object>} - AI-generated feedback
   */
  async reviewCode(codeSnippet) {
    return api.api("/ai/review", this.serviceKey, {
      method: "POST",
      body: JSON.stringify({ codeSnippet }),
    });
  }

  /**
   * Run a full AI review for a commit (with commit info + files)
   * @param {Object} payload - { repo, commit_id, files: [{path, diff}] }
   * @returns {Promise<Object>} - Full AI review results
   */
  async runAIReview(payload) {
    return api.api("/ai/review", this.serviceKey, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export default new AIReviewService();
