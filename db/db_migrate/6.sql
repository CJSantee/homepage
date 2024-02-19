CREATE TABLE IF NOT EXISTS pool_games (
  pool_game_id SERIAL PRIMARY KEY,
  started TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  winner_user_id BIGINT REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS pool_racks (
  pool_rack_id SERIAL PRIMARY KEY,
  pool_game_id BIGINT NOT NULL REFERENCES pool_games (pool_game_id)
);

CREATE TABLE IF NOT EXISTS pool_game_users (
  pool_game_id BIGINT NOT NULL REFERENCES pool_games (pool_game_id),
  user_id BIGINT NOT NULL REFERENCES users (user_id),
  score INTEGER NOT NULL DEFAULT 0,
  handicap INTEGER NOT NULL DEFAULT 25
);

CREATE TABLE IF NOT EXISTS pool_rack_scores (
  pool_rack_id BIGINT NOT NULL REFERENCES pool_racks (pool_rack_id),
  user_id BIGINT REFERENCES users (user_id), -- NULL = dead ball
  score INTEGER NOT NULL DEFAULT 0 
);
