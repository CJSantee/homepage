WITH user_games AS (
  SELECT pool_game_id
  FROM pool_game_users
  INNER JOIN pool_games pg USING(pool_game_id)
  WHERE user_id = ${user_id}
    AND pg.archived IS NULL
)
SELECT
  pool_game_id,
  started,
  COALESCE(tags, '{}'::TEXT[]) AS tags,
  winner_user_id,
  jsonb_agg(jsonb_build_object(
  	'user_id', user_id,
  	'username', username,
    'score', score,
    'handicap', handicap,
  	'winner', winner_user_id = user_id
  )) AS users
FROM pool_games pg
INNER JOIN user_games ug USING(pool_game_id)
LEFT JOIN pool_game_users pgu USING(pool_game_id)
LEFT JOIN users u USING(user_id)
GROUP BY pg.pool_game_id, ug.pool_game_id
ORDER BY started DESC;
