SELECT 
  user_id,
  username,
  password
FROM users
WHERE (${username}::TEXT IS NULL OR username = ${username}::TEXT)
  AND (${user_id}::BIGINT IS NULL OR user_id = ${user_id}::BIGINT);
