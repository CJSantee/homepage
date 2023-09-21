SELECT 
  COUNT(user_wordle_id) AS played,
  COUNT(user_wordle_id) FILTER (WHERE num_guesses <> -1) / COUNT(user_wordle_id) AS win_percentage,
  jsonb_build_object(
  	'1', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 1),
  	'2', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 2),
  	'3', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 3),
  	'4', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 4),
  	'5', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 5),
  	'6', COUNT(user_wordle_id) FILTER (WHERE num_guesses = 6)
  ) AS guess_distribution
FROM user_wordles
WHERE user_id = ${user_id};
