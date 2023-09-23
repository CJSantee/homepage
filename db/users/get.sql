SELECT 
  user_id,
  username,
  password,
  acl
FROM users u
LEFT JOIN acls a USING(user_id)
WHERE archived IS NULL
  AND (${username}::TEXT IS NULL OR username = ${username}::TEXT)
  AND (${user_id}::BIGINT IS NULL OR user_id = ${user_id}::BIGINT);
