SELECT 
  u.user_id,
  username,
  password,
  acl,
  MAX(handle) AS handle, -- TODO: Support multiple handles,
  jsonb_build_object(
  	'8-Ball', MAX(eb.skill_level),
  	'9-Ball', MAX(nb.skill_level)
  ) AS skill_levels
FROM users u
LEFT JOIN acls a USING(user_id)
LEFT JOIN user_handles uh ON uh.user_id = u.user_id AND protocol = 's' AND blocked IS NULL
LEFT JOIN pool_user_skill_levels eb ON eb.user_id = u.user_id AND eb.discipline = '8-Ball'
LEFT JOIN pool_user_skill_levels nb ON nb.user_id = u.user_id AND nb.discipline = '9-Ball'
WHERE archived IS NULL
  AND (${username}::TEXT IS NULL OR LOWER(username) = LOWER(${username}::TEXT))
  AND (${user_id}::BIGINT IS NULL OR u.user_id = ${user_id}::BIGINT)
GROUP BY u.user_id, acl;
