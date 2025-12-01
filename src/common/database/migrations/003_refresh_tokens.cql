CREATE TABLE IF NOT EXISTS refresh_tokens (
  token_value TEXT PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);
