CREATE TABLE IF NOT EXISTS acls (
  acl_id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users (user_id),
  acl TEXT NOT NULL
);

ALTER TABLE users 
  ALTER COLUMN password DROP NOT NULL,
  ADD COLUMN archived TIMESTAMPTZ,
  ADD CONSTRAINT unique_username UNIQUE (username);
