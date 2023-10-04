UPDATE user_handles
SET blocked = NOW()
WHERE handle = ${handle};
