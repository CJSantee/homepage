CREATE UNIQUE INDEX acl_user_idx ON acls(user_id);

CREATE TABLE IF NOT EXISTS user_handles (
  handle TEXT NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  protocol VARCHAR(16),
  blocked TIMESTAMPTZ,
  CONSTRAINT user_handles_pk PRIMARY KEY (handle, protocol)
);

CREATE TYPE message_direction AS ENUM ('INCOMING', 'OUTGOING');

CREATE TABLE IF NOT EXISTS messages (
  message_id SERIAL PRIMARY KEY,
  x_message_id TEXT,
  message TEXT,
  direction message_direction NOT NULL,
  to_handle TEXT,
  from_handle TEXT,
  user_id BIGINT REFERENCES users(user_id),
  parent_message_id BIGINT,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (parent_message_id) REFERENCES messages(message_id)
);

CREATE TABLE IF NOT EXISTS wordles (
  wordle_number INTEGER NOT NULL PRIMARY KEY,
  wordle TEXT NOT NULL,
  wordle_date DATE NOT NULL DEFAULT CURRENT_DATE
);
