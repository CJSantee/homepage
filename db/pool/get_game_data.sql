WITH players AS (
  SELECT 
    pool_game_id,
	username,
    user_id, 
    score, 
    handicap
  FROM pool_game_users
  INNER JOIN users u USING(user_id)
  WHERE pool_game_id = ${pool_game_id}
  UNION ALL (SELECT ${pool_game_id}, 'Dead Balls', NULL, 0, 25)
)
SELECT 
  p.username,
  p.user_id, 
  jsonb_agg(COALESCE(prs.score, 0) ORDER BY prs.pool_rack_id) AS racks,
  SUM(prs.score) AS total,
  p.handicap - p.score AS remaining
FROM players p
LEFT JOIN pool_racks pr USING(pool_game_id)
LEFT JOIN pool_rack_scores prs ON prs.pool_rack_id = pr.pool_rack_id AND 
  (prs.user_id = p.user_id OR (prs.user_id IS NULL AND p.user_id IS NULL))
WHERE pool_game_id = ${pool_game_id}
GROUP BY p.username, p.user_id, p.score, p.handicap
ORDER BY user_id ASC;
