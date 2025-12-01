CREATE TABLE IF NOT EXISTS ${KEYSPACE}.password_resets (
  token_value text PRIMARY KEY,
  user_id uuid,
  created_at timestamp,
  expires_at timestamp
);
