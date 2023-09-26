SELECT
  u.user_id,
  u.username,
  AVG(
    CASE 
  	  WHEN num_guesses = -1
      THEN 7
      ELSE num_guesses
    END
  ) as average_guesses
FROM user_wordles uw
LEFT JOIN users u USING(user_id)
GROUP BY u.user_id
ORDER BY average_guesses;
