import express from "express";
import { getUserRepos, getRepoCommits, getCommitsByQuery, getPullsByQuery } from "../controller/repo.controller.js";

const router = express.Router();

// Path-style endpoints
router.get("/repos/:username", getUserRepos);
router.get("/repos/:username/:repo/commits", getRepoCommits);

// Query-style simple endpoints as documented: /repos, /commits, /pulls
router.get("/commits", getCommitsByQuery);
router.get("/pulls", getPullsByQuery);

export default router;
