SELECT
  acl_id,
  user_id,
  acl
FROM acls
WHERE user_id = ${user_id};
