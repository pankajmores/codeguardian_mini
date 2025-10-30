import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }
});

export const fetchRepoDetails = async (owner, repo) => {
  try {
    const response = await gh.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repo details:', error.message);
    throw new Error(`Failed to fetch repo details: ${error.message}`);
  }
};

export const fetchCommits = async (owner, repo) => {
  try {
    const response = await gh.get(`/repos/${owner}/${repo}/commits`);
   return response.data.map((commit) => ({
  commit_id: commit.sha,
  author: commit?.commit?.author?.name || commit?.author?.login || 'Unknown',
  message: commit?.commit?.message || '',
  date: commit?.commit?.author?.date || new Date().toISOString(),
  url: commit?.html_url || '',
  repo
}));
  } catch (error) {
    console.error('Error fetching commits:', error.message);
    throw new Error(`Failed to fetch commits: ${error.message}`);
  }
};

export const fetchPulls = async (owner, repo) => {
  try {
    const response = await gh.get(`/repos/${owner}/${repo}/pulls`);
    return response.data.map((pr) => ({
      id: pr.id,
      title: pr.title,
      user: pr.user.login,
      state: pr.state,
      created_at: pr.created_at,
      url: pr.html_url,
      repo: repo
    }));
  } catch (error) {
    console.error('Error fetching pull requests:', error.message);
    throw new Error(`Failed to fetch pull requests: ${error.message}`);
  }
};