INSERT INTO acls (
  user_id, 
  acl
) VALUES (
  ${user_id},
  ${acl}
) RETURNING acl;