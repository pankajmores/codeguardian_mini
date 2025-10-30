import axios from "axios";
import dotenv from "dotenv";
import { fetchCommits, fetchPulls } from "../services/github.service.js";
import { initDB } from "../services/db.js";
import { Commit } from "../services/db.js";
dotenv.config();

const gh = axios.create({
  baseURL: "https://api.github.com",
  headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
});

export const getUserRepos = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await gh.get(`/users/${username}/repos`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching repos:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

export const getRepoCommits = async (req, res) => {
  const { username, repo } = req.params;
  try {
    const data = await fetchCommits(username, repo);
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response from GitHub API');
    }

    // Initialize DB connection
    const db = await initDB();

    // Save commits to DB with better error handling
    for (const commit of data) {
      try {
        await Commit.findOrCreate({
          where: { sha: commit.commit_id },
          defaults: {
            repoName: commit.repo,
            author: commit.author || 'Unknown',
            message: commit.message || '',
            date: commit.date || new Date(),
          },
        });

      } catch (dbError) {
        console.error(`Error saving commit ${commit.sha}:`, dbError.message);
        // Continue with next commit even if one fails
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error in getRepoCommits:', error);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error occurred'
    });
  }
};

// Query-form endpoints: /api/commits?owner=&repo=
export const getCommitsByQuery = async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) return res.status(400).json({ error: "owner and repo are required" });
  try {
    const data = await fetchCommits(owner, repo);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

export const getPullsByQuery = async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) return res.status(400).json({ error: "owner and repo are required" });
  try {
    const data = await fetchPulls(owner, repo);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
