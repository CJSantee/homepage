UPDATE users
SET archived = NOW()
WHERE user_id = ${user_id};
