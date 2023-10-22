SELECT 
  user_wordle_id,
  user_id,
  wordle_number,
  num_guesses,
  hard_mode,
  guess_rows,
  submitted,
  submitted::DATE AS submitted_date
FROM user_wordles
WHERE user_id = ${user_id}
ORDER BY submitted DESC;
