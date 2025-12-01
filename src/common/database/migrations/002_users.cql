CREATE TABLE IF NOT EXISTS users_by_email (
  email TEXT PRIMARY KEY,
  user_id UUID,
  name TEXT,
  password_hash TEXT,
  birth_date TIMESTAMP,
  role TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS users_by_id (
  user_id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  password_hash TEXT,
  birth_date TIMESTAMP,
  role TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS users_by_created_at (
  created_at TIMESTAMP,
  user_id UUID,
  email TEXT,
  name TEXT,
  role TEXT,
  is_active BOOLEAN,
  PRIMARY KEY (created_at, user_id)
);

