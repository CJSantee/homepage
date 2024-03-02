UPDATE users
SET username = COALESCE(${username}, username),
  password = COALESCE(${password}, password)
WHERE user_id = ${user_id}
RETURNING user_id, username;
