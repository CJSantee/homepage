SELECT 
  SUM(
    CASE WHEN winner_user_id = user_id 
      THEN 1
      ELSE 0
    END
  ) AS games_won,
  COUNT(*) AS games_played,
  MAX(skill_level) AS skill_level
FROM pool_game_users
INNER JOIN pool_user_skill_levels USING(user_id)
INNER JOIN pool_games pg USING(pool_game_id)
WHERE user_id = ${user_id}
  AND pg.winner_user_id IS NOT NULL
  AND pg.archived IS NULL;