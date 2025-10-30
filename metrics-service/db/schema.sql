-- CodeGuardian Metrics Database Schema

CREATE DATABASE IF NOT EXISTS codeguardian_metrics;
USE codeguardian_metrics;

-- Commits table
CREATE TABLE IF NOT EXISTS commits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commit_id VARCHAR(255) UNIQUE NOT NULL,
  developer VARCHAR(255) NOT NULL,
  repo VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  url VARCHAR(500),
  INDEX idx_developer (developer),
  INDEX idx_repo (repo),
  INDEX idx_created_at (created_at)
);

-- Pull Requests table
CREATE TABLE IF NOT EXISTS pull_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pr_id VARCHAR(255) UNIQUE NOT NULL,
  repo VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  developer VARCHAR(255) NOT NULL,
  state VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  merged_at TIMESTAMP NULL,
  url VARCHAR(500),
  INDEX idx_developer (developer),
  INDEX idx_repo (repo),
  INDEX idx_state (state)
);

-- AI Reviews table
CREATE TABLE IF NOT EXISTS ai_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commit_id VARCHAR(255) NOT NULL,
  repo VARCHAR(255) NOT NULL,
  review_text TEXT,
  score INT DEFAULT 0,
  issues_count INT DEFAULT 0,
  suggestions_count INT DEFAULT 0,
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (commit_id) REFERENCES commits(commit_id) ON DELETE CASCADE,
  INDEX idx_commit (commit_id),
  INDEX idx_score (score)
);

-- Developer Metrics aggregation view
CREATE OR REPLACE VIEW developer_metrics AS
SELECT 
  c.developer,
  COUNT(DISTINCT c.commit_id) as total_commits,
  COUNT(DISTINCT pr.pr_id) as total_prs,
  AVG(ar.score) as avg_review_score,
  SUM(ar.issues_count) as total_issues,
  MAX(c.created_at) as last_commit_date
FROM commits c
LEFT JOIN pull_requests pr ON c.developer = pr.developer AND c.repo = pr.repo
LEFT JOIN ai_reviews ar ON c.commit_id = ar.commit_id
GROUP BY c.developer;

-- Team activity view
CREATE OR REPLACE VIEW team_activity AS
SELECT 
  DATE(created_at) as activity_date,
  repo,
  COUNT(*) as daily_commits,
  COUNT(DISTINCT developer) as active_developers
FROM commits
GROUP BY DATE(created_at), repo
ORDER BY activity_date DESC;
