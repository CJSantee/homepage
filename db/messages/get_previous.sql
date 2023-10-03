-- TODO: Rework to check for handle / user_id to account for multiple users messaging intermittently
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
  AND message_id < ${message_id}
ORDER BY message_id DESC
LIMIT 1;
