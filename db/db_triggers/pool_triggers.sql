CREATE OR REPLACE FUNCTION cs_create_player_rack_scores() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pool_rack_scores (pool_rack_id, user_id)
  SELECT NEW.pool_rack_id, pgu.user_id
  FROM pool_game_users pgu
  WHERE pgu.pool_game_id = NEW.pool_game_id;

  INSERT INTO pool_rack_scores(pool_rack_id, user_id)
  VALUES (NEW.pool_rack_id, NULL);
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cs_create_player_rack_scores_trg
AFTER INSERT ON pool_racks
FOR EACH ROW
EXECUTE PROCEDURE cs_create_player_rack_scores();

CREATE OR REPLACE FUNCTION cs_update_pool_game_user_score() RETURNS TRIGGER AS $$
DECLARE
  _pool_game_id BIGINT;
BEGIN
  SELECT pool_game_id
  FROM pool_racks
  WHERE pool_rack_id = NEW.pool_rack_id
  INTO _pool_game_id;
  
  WITH pool_game_racks AS (
    SELECT pool_rack_id
    FROM pool_racks
    WHERE pool_game_id = _pool_game_id
  ), player_game_score AS (
    SELECT SUM(score) AS score
    FROM pool_rack_scores
    INNER JOIN pool_game_racks USING(pool_rack_id)
    WHERE user_id = NEW.user_id
  )
  UPDATE pool_game_users
  SET score = pgs.score
  FROM player_game_score pgs
  WHERE pool_game_id = _pool_game_id
    AND user_id = NEW.user_id;
  
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER cs_update_pool_game_user_score_trg
AFTER UPDATE ON pool_rack_scores 
FOR EACH ROW
WHEN (NEW.score <> OLD.score
 AND NEW.user_id IS NOT NULL)
EXECUTE PROCEDURE cs_update_pool_game_user_score();

CREATE OR REPLACE FUNCTION cs_update_pool_game_winner() RETURNS TRIGGER AS $$ 
BEGIN
  UPDATE pool_games
  SET winner_user_id = NEW.user_id
  WHERE pool_game_id = NEW.pool_game_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cs_update_game_winner_trg
AFTER UPDATE ON pool_game_users
FOR EACH ROW
WHEN (NEW.score = OLD.handicap)
EXECUTE PROCEDURE cs_update_pool_game_winner();

CREATE OR REPLACE FUNCTION cs_insert_pool_user_skill_level() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pool_user_skill_levels (user_id, discipline)
  SELECT NEW.user_id AS user_id, discipline
  FROM UNNEST('{"9-Ball", "8-Ball"}'::game_type_enum[]) AS discipline;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cs_insert_skill_level_trg
AFTER INSERT ON acls 
FOR EACH ROW
WHEN (NEW.acl = 'pool')
EXECUTE PROCEDURE cs_insert_pool_user_skill_level();
