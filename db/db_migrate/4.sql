CREATE TABLE IF NOT EXISTS user_wordles (
  user_wordle_id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users (user_id),
  wordle_number INTEGER NOT NULL,
  num_guesses INTEGER NOT NULL,
  hard_mode BOOLEAN NOT NULL DEFAULT FALSE,
  guess_rows JSONB NOT NULL,
  submitted TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX user_id_wordle_number_idx ON user_wordles (user_id, wordle_number);
