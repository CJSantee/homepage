WITH players AS (
  SELECT 
    pgu.pool_game_id,
	  username,
    COALESCE(user_id, '-1') AS user_id, -- represent deadballs as '-1' 
    score, 
    handicap,
    pg.winner_user_id IS NOT NULL AS winner
  FROM pool_game_users pgu
  INNER JOIN users u USING(user_id)
  LEFT JOIN pool_games pg ON (pg.pool_game_id = pgu.pool_game_id 
    AND pg.winner_user_id = u.user_id)
  WHERE pgu.pool_game_id = ${pool_game_id}
  UNION ALL (SELECT ${pool_game_id}, 'Dead Balls', NULL, 0, 25, FALSE)
)
SELECT 
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
GROUP BY p.username, p.user_id, p.score, p.handicap, p.winner
ORDER BY user_id ASC;
