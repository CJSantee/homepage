SELECT *
FROM users
WHERE ${username}::TEXT IS NULL OR username = ${username};
