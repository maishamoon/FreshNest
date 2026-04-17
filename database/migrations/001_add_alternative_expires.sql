ALTER TABLE failure_alternative_requests 
  ADD COLUMN expires_at DATETIME DEFAULT NULL AFTER status,
  ADD INDEX idx_expires (expires_at);
