CREATE OR REPLACE FUNCTION cs_create_new_pool_game(_users JSONB) RETURNS BIGINT AS $$
DECLARE
  _pool_game_id BIGINT;
  _pool_rack_id BIGINT;
  _user_id BIGINT;
  _handicap INTEGER;
BEGIN
  -- Create new game
  INSERT INTO pool_games DEFAULT VALUES
  RETURNING pool_game_id INTO _pool_game_id;
  
  -- Add users
  FOR _user_id, _handicap IN (SELECT user_id, handicap FROM jsonb_to_recordset(_users) AS users(user_id BIGINT, handicap INTEGER)) LOOP
    IF _handicap IS NULL THEN
      _handicap := 25;
    END IF;
    INSERT INTO pool_game_users (pool_game_id, user_id, handicap)
    VALUES (_pool_game_id, _user_id, _handicap);
  END LOOP;
  
  -- Create first rack (will trigger insert of pool_rack_scores)
  INSERT INTO pool_racks (pool_game_id) 
  VALUES (_pool_game_id)
  RETURNING pool_rack_id INTO _pool_rack_id;
  
  RETURN _pool_game_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION cs_add_pool_player_score(_pool_game_id BIGINT, _user_id BIGINT) RETURNS INTEGER AS $$
DECLARE
  _pool_rack_id BIGINT;
  _player_game_score INTEGER;
  _player_rack_score INTEGER; 
  _pool_rack_score INTEGER;
BEGIN
  IF _user_id IS NOT NULL THEN
    -- Confirm user is playing in the game
    SELECT user_id, score
    FROM pool_game_users
    WHERE pool_game_id = _pool_game_id
      AND user_id = _user_id
    INTO _user_id,
      _player_game_score;
    
    IF _user_id IS NULL THEN
      RAISE EXCEPTION 'User is not playing in this game.';
    END IF;
  END IF;

  -- Get current rack
  SELECT pool_rack_id
  FROM pool_racks
  WHERE pool_game_id = _pool_game_id
  ORDER BY pool_rack_id DESC
  LIMIT 1
  INTO _pool_rack_id;
  
  -- Get current rack count
  SELECT SUM(score)
  FROM pool_rack_scores
  WHERE pool_rack_id = _pool_rack_id
  INTO _pool_rack_score;
  
  IF _pool_rack_score = 10 THEN
  	-- Create new rack
  	INSERT INTO pool_racks (pool_game_id)
    VALUES (_pool_game_id) 
 	  RETURNING pool_rack_id INTO _pool_rack_id;

    _pool_rack_score := 0;
  END IF;
  
  -- Update the player's rack score
  UPDATE pool_rack_scores 
  SET score = score + 1
  WHERE pool_rack_id = _pool_rack_id
    AND (user_id = _user_id 
     OR (user_id IS NULL AND _user_id IS NULL))
  RETURNING score INTO _player_rack_score;

  RETURN (_player_game_score + 1);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cs_subtract_pool_player_score(_pool_game_id BIGINT, _user_id BIGINT) RETURNS INTEGER AS $$
DECLARE
  _pool_rack_id BIGINT;
  _player_game_score INTEGER;
  _player_rack_score INTEGER; 
  _pool_rack_score INTEGER;
BEGIN
  
  SELECT score
  FROM pool_game_users
  WHERE pool_game_id = _pool_game_id
    AND user_id = _user_id
  INTO _player_game_score;
  
  -- Score cannot be subtracted
  IF _player_game_score = 0 THEN
  	RETURN 0;
  END IF;

  -- Get current rack
  SELECT 
    pr.pool_rack_id,
  	score
  FROM pool_racks pr
  INNER JOIN pool_rack_scores USING(pool_rack_id)
  WHERE pool_game_id = _pool_game_id
    AND (user_id = _user_id 
     OR (user_id IS NULL AND _user_id IS NULL))
  ORDER BY pr.pool_rack_id DESC 
  LIMIT 1
  INTO _pool_rack_id,
    _player_rack_score;

  -- Get the total score of the current rack  
  SELECT SUM(score)
  FROM pool_rack_scores
  WHERE pool_rack_id = _pool_rack_id
  INTO _pool_rack_score;
   
  -- If you can't remove any from the current rack, check the previous rack
  IF _pool_rack_score = 0 THEN
    DELETE FROM pool_rack_scores
    WHERE pool_rack_id = _pool_rack_id;

    DELETE FROM pool_racks 
    WHERE pool_rack_id = _pool_rack_id;

  	-- Get the previous pool_rack_id
  	SELECT pool_rack_id
    FROM pool_racks
    WHERE pool_game_id = _pool_game_id
    ORDER BY pool_rack_id DESC 
    LIMIT 1
    INTO _pool_rack_id;
    
    SELECT score
    FROM pool_rack_scores
    WHERE pool_rack_id = _pool_rack_id
      AND user_id = _user_id
    INTO _player_rack_score;
      
    IF _player_rack_score = 0 THEN
      RAISE EXCEPTION 'Cannot remove player score from current rack';
    END IF;    
  ELSIF _player_rack_score = 0 THEN
    RAISE EXCEPTION 'Cannot remove player score from current rack';
  END IF;
  
  UPDATE pool_rack_scores
  SET score = score - 1
  WHERE pool_rack_id = _pool_rack_id
    AND (user_id = _user_id 
     OR (user_id IS NULL AND _user_id IS NULL));
  
  RETURN (_player_game_score - 1);
END;
$$ LANGUAGE plpgsql;
