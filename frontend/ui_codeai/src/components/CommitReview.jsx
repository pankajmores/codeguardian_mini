import { useState } from "react";
import RepoService from "../services/repoService";
import AIReviewService from "../services/aiReviewService";

/**
 * CommitReview Component
 * Shows commits, lets you view details and get AI-based code review
 */
const CommitReview = ({ owner, repo }) => {
  const [commits, setCommits] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load recent commits
  const fetchCommits = async () => {
    try {
      setError(null);
      const result = await RepoService.getCommitsByQuery(owner, repo);
      setCommits(result);
    } catch (err) {
      setError("Failed to fetch commits");
      console.error(err);
    }
  };

  // View commit details (files & diffs)
  const viewCommit = async (commitSha) => {
    try {
      setError(null);
      setSelectedCommit(null);
      setReview(null);
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_INSIGHT_SERVICE_URL}/api/commits/${owner}/${repo}/${commitSha}`
      );
      const data = await res.json();
      setSelectedCommit(data);
    } catch (err) {
      setError("Failed to load commit details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Review commit via AI
  // Review commit via AI
const reviewCommit = async () => {
  if (!selectedCommit) return;
  setLoading(true);
  setReview(null);
  try {
    // 🧠 Combine all diffs from the commit into one string
    const codeSnippet = selectedCommit.files
      .map((f) => `File: ${f.path}\n${f.diff || ""}`)
      .join("\n\n");

    // ✅ Send actual diff text to AI service
    const result = await AIReviewService.reviewCode(codeSnippet);
    setReview(result);
  } catch (err) {
    setError("AI review failed");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔍 Commit Review - {repo}
      </h2>

      {/* Load Commits */}
      <button
        onClick={fetchCommits}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Load Commits
      </button>

      {/* Commits List */}
      <div className="space-y-2 mt-4">
        {commits.map((c) => (
          <div key={c.sha} className="border rounded p-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.commit.message}</p>
                <p className="text-xs text-gray-500">
                  {c.commit.author.name} — {new Date(c.commit.author.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => viewCommit(c.sha)}
                className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                View Commit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Commit Details */}
      {selectedCommit && (
        <div className="mt-6 border rounded-lg bg-white shadow p-4">
          <h3 className="text-lg font-semibold mb-2">
            Commit Details: {selectedCommit.commit_id}
          </h3>
          {selectedCommit.files.map((f, i) => (
            <div key={i} className="mt-3">
              <p className="font-medium">{f.path}</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60 border">
                {f.diff || "No diff available"}
              </pre>
            </div>
          ))}
          <button
            onClick={reviewCommit}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Reviewing..." : "Review Commit with AI 🤖"}
          </button>
        </div>
      )}

      {/* AI Review Result */}
      {review && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">AI Review Result</h3>
          <pre className="text-sm whitespace-pre-wrap mt-2 text-gray-700">
            {review.content || review.review}
          </pre>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default CommitReview;
