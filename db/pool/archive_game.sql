UPDATE pool_games
SET archived = NOW()
WHERE pool_game_id = ${pool_game_id};
