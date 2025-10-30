import { useState } from "react";
import AIReviewService from "../services/aiReviewService";
import CommitReview from "../components/CommitReview";

export default function CodeReview() {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [aiReview, setAiReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const owner = selectedCommit?.owner;
  const repo = selectedCommit?.repo;
  const sha = selectedCommit?.sha;

  // 🧠 Manual AI Review
  const handleManualReview = async () => {
    if (!codeSnippet.trim()) {
      setError("⚠️ Please paste some code before reviewing.");
      return;
    }

    setError(null);
    setLoading(true);
    setAiReview(null);

    try {
      const response = await AIReviewService.reviewCode(codeSnippet);
      setAiReview(response);
    } catch (err) {
      console.error("AI Review failed:", err);
      setError("❌ AI review failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🧠 AI Code Review</h1>

      {/* 💬 Manual Code Review */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          💬 Manual Code Review
        </h3>
        <p className="text-gray-600 mb-3 text-sm">
          Paste your code snippet below and let the AI review it for bugs,
          performance issues, and best practices.
        </p>

        <textarea
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          rows="10"
          placeholder="// Paste your code here..."
          className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div className="mt-4 flex items-center space-x-3">
          <button
            onClick={handleManualReview}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Reviewing..." : "Review with AI 🤖"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* ✅ AI Review Result */}
        {aiReview && (
          <div className="mt-6 bg-white border border-green-200 rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-green-700 mb-2">
              ✅ AI Review Result
            </h4>
            <pre className="text-gray-800 text-sm whitespace-pre-wrap">
              {aiReview.review || aiReview.content || "No feedback available."}
            </pre>
            {aiReview.score && (
              <p className="mt-2 text-sm text-gray-500">
                Confidence Score: <strong>{aiReview.score}</strong> / 100 (
                {aiReview.source || "AI"})
              </p>
            )}
          </div>
        )}
      </div>

      {/* 🔍 Commit Review Section */}
      {selectedCommit ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            🔍 Commit Review: {selectedCommit.sha?.slice(0, 7)}
          </h2>
          <CommitReview owner={owner} repo={repo} sha={sha} />
        </div>
      ) : (
        <div className="text-gray-600 text-center py-10 border border-gray-100 rounded-lg bg-white shadow-sm">
          <p>Select a commit to review.</p>
        </div>
      )}
    </div>
  );
}
