SELECT 
  SUM(
    CASE WHEN winner_user_id = u.user_id 
      THEN 1
      ELSE 0
    END
  ) AS games_won,
  COUNT(*) AS games_played,
  jsonb_build_object(
  	'8-Ball', MAX(eb.skill_level),
  	'9-Ball', MAX(nb.skill_level)
  ) AS skill_levels
FROM pool_game_users u
INNER JOIN pool_games pg USING(pool_game_id)
LEFT JOIN pool_user_skill_levels eb ON eb.user_id = u.user_id AND eb.discipline = '8-Ball'
LEFT JOIN pool_user_skill_levels nb ON nb.user_id = u.user_id AND nb.discipline = '9-Ball'
WHERE u.user_id = ${user_id}
  AND pg.winner_user_id IS NOT NULL
  AND pg.archived IS NULL;