INSERT INTO user_wordles (
  user_id,
  wordle_number,
  num_guesses,
  hard_mode,
  guess_rows
) VALUES (
  ${user_id},
  ${wordle_number},
  ${num_guesses},
  ${hard_mode},
  ${guess_rows}
) RETURNING user_wordle_id, user_id, wordle_number, num_guesses, hard_mode, guess_rows, submitted;
