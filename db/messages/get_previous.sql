SELECT
  message_id,
  x_message_id,
  message,
  direction,
  to_handle,
  from_handle,
  user_id,
  parent_message_id,
  created
FROM messages
WHERE direction = 'INCOMING'
  AND (${user_id}::BIGINT IS NULL OR user_id = ${user_id})
  AND (${from_handle}::TEXT IS NULL OR from_handle = ${from_handle})
  AND (${lookback_interval}::INTERVAL IS NULL OR created > NOW() - ${lookback_interval}::INTERVAL)
ORDER BY message_id DESC;
