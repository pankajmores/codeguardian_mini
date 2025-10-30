-- Seed data for CodeGuardian Metrics
USE codeguardian_metrics;

-- Insert sample commits
INSERT INTO commits (commit_id, developer, repo, message, url) VALUES
('abc123def456', 'Alice Johnson', 'codeguardian/web-app', 'Add user authentication', 'https://github.com/owner/repo/commit/abc123'),
('def789ghi012', 'Bob Smith', 'codeguardian/web-app', 'Fix login bug', 'https://github.com/owner/repo/commit/def789'),
('ghi345jkl678', 'Alice Johnson', 'codeguardian/api', 'Implement REST endpoints', 'https://github.com/owner/repo/commit/ghi345'),
('jkl901mno234', 'Carol Williams', 'codeguardian/web-app', 'Add dark mode', 'https://github.com/owner/repo/commit/jkl901'),
('mno567pqr890', 'Bob Smith', 'codeguardian/api', 'Optimize database queries', 'https://github.com/owner/repo/commit/mno567'),
('pqr123stu456', 'David Brown', 'codeguardian/mobile', 'Add push notifications', 'https://github.com/owner/repo/commit/pqr123'),
('stu789vwx012', 'Alice Johnson', 'codeguardian/web-app', 'Update dependencies', 'https://github.com/owner/repo/commit/stu789'),
('vwx345yza678', 'Emily Davis', 'codeguardian/api', 'Add rate limiting', 'https://github.com/owner/repo/commit/vwx345'),
('yza901bcd234', 'Bob Smith', 'codeguardian/mobile', 'Fix crash on Android', 'https://github.com/owner/repo/commit/yza901'),
('bcd567efg890', 'Carol Williams', 'codeguardian/web-app', 'Improve UI responsiveness', 'https://github.com/owner/repo/commit/bcd567'),
('efg123hij456', 'David Brown', 'codeguardian/api', 'Add caching layer', 'https://github.com/owner/repo/commit/efg123'),
('hij789klm012', 'Alice Johnson', 'codeguardian/web-app', 'Update documentation', 'https://github.com/owner/repo/commit/hij789'),
('klm345nop678', 'Frank Miller', 'codeguardian/mobile', 'Add biometric authentication', 'https://github.com/owner/repo/commit/klm345'),
('nop901qrs234', 'Bob Smith', 'codeguardian/api', 'Fix security vulnerability', 'https://github.com/owner/repo/commit/nop901'),
('qrs567tuv890', 'Carol Williams', 'codeguardian/web-app', 'Add unit tests', 'https://github.com/owner/repo/commit/qrs567'),
('tuv123wxy456', 'Grace Wilson', 'codeguardian/api', 'Implement GraphQL', 'https://github.com/owner/repo/commit/tuv123'),
('wxy789zab012', 'David Brown', 'codeguardian/mobile', 'Add offline support', 'https://github.com/owner/repo/commit/wxy789'),
('zab345cde678', 'Alice Johnson', 'codeguardian/web-app', 'Refactor components', 'https://github.com/owner/repo/commit/zab345'),
('cde901fgh234', 'Emily Davis', 'codeguardian/api', 'Add request validation', 'https://github.com/owner/repo/commit/cde901'),
('fgh567ijk890', 'Bob Smith', 'codeguardian/web-app', 'Optimize bundle size', 'https://github.com/owner/repo/commit/fgh567');

-- Insert sample AI reviews
INSERT INTO ai_reviews (commit_id, repo, review_text, score, issues_count, suggestions_count) VALUES
('abc123def456', 'codeguardian/web-app', 'Good authentication implementation', 85, 1, 2),
('def789ghi012', 'codeguardian/web-app', 'Bug fix is solid', 90, 0, 1),
('ghi345jkl678', 'codeguardian/api', 'REST implementation needs work', 70, 3, 5);

