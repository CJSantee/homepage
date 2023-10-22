INSERT INTO messages (
  message,
  direction,
  to_handle,
  from_handle,
  user_id,
  x_message_id,
  parent_message_id
) VALUES (
  ${message},
  ${direction},
  ${to_handle},
  ${from_handle},
  ${user_id},
  ${x_message_id},
  ${parent_message_id}
) RETURNING message_id, message, direction, to_handle, from_handle, user_id, x_message_id, parent_message_id, created;
