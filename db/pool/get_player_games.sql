WITH user_games AS (
  SELECT pool_game_id
  FROM pool_game_users
  WHERE user_id = ${user_id}
)
SELECT
  pool_game_id,
  started,
  winner_user_id,
  jsonb_agg(jsonb_build_object(
  	'user_id', user_id,
  	'username', username,
  	'winner', winner_user_id = user_id
  )) AS users
FROM pool_games pg
INNER JOIN user_games ug USING(pool_game_id)
LEFT JOIN pool_game_users pgu USING(pool_game_id)
LEFT JOIN users u USING(user_id)
GROUP BY pg.pool_game_id, ug.pool_game_id;
