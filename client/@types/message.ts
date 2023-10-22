export default interface Message {
  message_id: string,
  x_message_id?: string,
  message: string,
  direction: 'INCOMING' | 'OUTGOING',
  to_handle: string,
  from_handle: string,
  user_id?: string,
  parent_message_id?: string,
  created: string,
};
