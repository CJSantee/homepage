CREATE TYPE game_type_enum AS ENUM ('8-Ball', '9-Ball');

ALTER TABLE pool_games ADD COLUMN game_type game_type_enum NOT NULL DEFAULT '9-Ball';

CREATE TABLE IF NOT EXISTS pool_user_skill_levels (
  user_id BIGINT NOT NULL REFERENCES users (user_id),
  skill_level SMALLINT NOT NULL DEFAULT 3,
  discipline game_type_enum NOT NULL,
  UNIQUE(user_id, discipline)
);
