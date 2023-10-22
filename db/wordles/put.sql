INSERT INTO wordles (
  wordle_number,
  wordle,
  wordle_date
) VALUES (
  ${wordle_number},
  ${wordle},
  COALESCE(${wordle_date}, CURRENT_DATE)
) RETURNING wordle_number, wordle, wordle_date;
