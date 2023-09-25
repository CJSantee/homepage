WITH wordles AS (
  SELECT 
    user_wordle_id,
  	user_id,  
  	wordle_number,
  	num_guesses,
  	submitted,
  	row_number() OVER (PARTITION BY user_id ORDER BY wordle_number) - wordle_number AS streak_id
  FROM user_wordles
  WHERE user_id = ${user_id}
), wordle_stats AS (
  SELECT 
    COUNT(user_wordle_id) AS played,
    COALESCE(COUNT(user_wordle_id) FILTER (WHERE num_guesses <> -1) / NULLIF(COUNT(user_wordle_id)::NUMERIC, 0), 0) AS win_percentage,
    jsonb_build_object(
  	  '1', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 1),
  	  '2', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 2),
  	  '3', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 3),
  	  '4', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 4),
  	  '5', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 5),
  	  '6', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 6)
    ) AS guess_distribution
  FROM wordles
), streaks AS (
  SELECT 
  	max(submitted) AS last_submitted, 
  	count(*) AS streak_length, 
  	streak_id
  FROM wordles
  GROUP BY streak_id
), max_streak AS (
  SELECT 
   	COALESCE(max(streak_length), 0) AS max_streak
  FROM streaks
), current_streak AS (
  SELECT 
  	streak_length AS current_streak
  FROM streaks
  WHERE last_submitted > (NOW() - INTERVAL '1 DAY')
) SELECT 
  played, 
  win_percentage, 
  COALESCE(current_streak, 0) AS current_streak, 
  max_streak, 
  guess_distribution
FROM wordle_stats
LEFT JOIN current_streak ON TRUE
CROSS JOIN max_streak;
