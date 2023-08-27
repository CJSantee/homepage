SELECT *
FROM users
WHERE (${get_all}::BOOLEAN AND ${username}::TEXT IS NULL) OR username = ${username};
