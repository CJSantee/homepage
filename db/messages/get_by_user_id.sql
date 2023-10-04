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
WHERE user_id = ${user_id} -- TODO: Also check to_handle and from_handle for handles associated with user_id
ORDER BY created ASC; 
