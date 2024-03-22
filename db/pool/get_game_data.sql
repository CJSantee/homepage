WITH game AS (
  SELECT 
    pool_game_id, 
    game_type,
    winner_user_id
  FROM pool_games
  WHERE pool_game_id = ${pool_game_id}
), players AS (
  SELECT 
    pgu.pool_game_id,
	  username,
    COALESCE(user_id, '-1') AS user_id, -- represent deadballs as '-1' 
    score, 
    handicap,
    pgu.user_id = g.winner_user_id AS winner
  FROM pool_game_users pgu
  INNER JOIN users u USING(user_id)
  INNER JOIN game g USING(pool_game_id)
  UNION ALL (
    SELECT 
      pool_game_id, 
      'Dead Balls', 
      NULL, 
      0, 
      25, 
      FALSE
    FROM game
    WHERE game_type = '9-Ball'
  )
), player_racks AS (
  SELECT 
    p.pool_game_id,
    p.username,
    p.user_id, 
    jsonb_agg(COALESCE(prs.score, 0) ORDER BY prs.pool_rack_id) AS racks,
    SUM(prs.score)::INTEGER AS total,
    p.handicap,
    p.handicap - p.score AS remaining,
    winner
  FROM players p
  LEFT JOIN pool_racks pr USING(pool_game_id)
  LEFT JOIN pool_rack_scores prs ON prs.pool_rack_id = pr.pool_rack_id AND 
    (prs.user_id = p.user_id OR (prs.user_id IS NULL AND p.user_id IS NULL))
  GROUP BY p.pool_game_id, p.username, p.user_id, p.score, p.handicap, p.winner
  ORDER BY user_id ASC
)
SELECT 
  g.pool_game_id,
  g.game_type,
  jsonb_agg(
    jsonb_build_object(
      'username', username,
      'user_id', user_id,
      'racks', racks,
      'total', total,
      'handicap', handicap,
      'remaining', remaining,
      'winner', winner
    )
  ) AS players
FROM game g
LEFT JOIN player_racks pr ON pr.pool_game_id = g.pool_game_id
GROUP BY g.pool_game_id, g.game_type
LIMIT 1;
