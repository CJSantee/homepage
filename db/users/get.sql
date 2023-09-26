SELECT 
  u.user_id,
  username,
  password,
  acl,
  MAX(handle) AS handle -- TODO: Support multiple handles
FROM users u
LEFT JOIN acls a USING(user_id)
LEFT JOIN user_handles uh ON uh.user_id = u.user_id AND protocol = 's'
WHERE archived IS NULL
  AND (${username}::TEXT IS NULL OR username = ${username}::TEXT)
  AND (${user_id}::BIGINT IS NULL OR u.user_id = ${user_id}::BIGINT)
GROUP BY u.user_id, acl;;
