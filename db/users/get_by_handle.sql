SELECT 
  user_id,
  username,
  acl,
  handle
FROM users 
LEFT JOIN acls USING(user_id)
LEFT JOIN user_handles USING(user_id)
WHERE handle = ${handle};
