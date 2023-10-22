INSERT INTO users(
  username,
  password
) VALUES (
  ${username},
  ${password}
) RETURNING user_id, username;
