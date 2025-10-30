import api from "./api.js";

/**
 * Repo Service - GitHub repository operations
 */
class RepoService {
  constructor() {
    this.baseUrl = api.API_BASE.REPO_SERVICE;
  }

  /**
   * Get repositories for a GitHub username
   * @param {string} username - GitHub username
   * @returns {Promise<Array>} List of repositories
   */
  async getUserRepos(username) {
    return api.api(`/repos/${username}`, "REPO_SERVICE");
  }

  /**
   * Get commits for a specific repository
   * @param {string} username - GitHub username
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} List of commits
   */
  async getRepoCommits(username, repo) {
    return api.api(`/repos/${username}/${repo}/commits`, "REPO_SERVICE");
  }

  /**
   * Get commits using query parameters
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} List of commits
   */
  async getCommitsByQuery(owner, repo) {
    return api.api(`/commits?owner=${owner}&repo=${repo}`, "REPO_SERVICE");
  }

  /**
   * Get pull requests using query parameters
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} List of pull requests
   */
  async getPullsByQuery(owner, repo) {
    return api.api(`/pulls?owner=${owner}&repo=${repo}`, "REPO_SERVICE");
  }

  /**
   * Get full commit details (message, author, changed files, etc.)
   */
  async getCommitDetails(owner, repo, sha) {
    return api.api(`/repos/${owner}/${repo}/commits/${sha}`, "REPO_SERVICE");
  }

  /**
   * Get raw commit diff directly from GitHub API
   * This shows the actual code changes in a commit.
   */
  async getCommitDiff(owner, repo, sha) {
    const githubUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;
    const res = await fetch(githubUrl, {
      headers: { Accept: "application/vnd.github.v3.diff" },
    });
    if (!res.ok) throw new Error("Failed to fetch commit diff from GitHub");
    return await res.text();
  }
}

export default new RepoService();
