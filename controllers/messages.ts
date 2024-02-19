import db from "../db";
import Message, { MessageParams } from "../types/models/message";

export async function insertMessage(message:MessageParams): Promise<Message> {
  const {rows: [dbMessage]} = await db.file<Message>('db/messages/put.sql', message);
  return dbMessage;
}

type GetPreviousMessageParams = {
  user_id: string,
  from_handle: string,
  lookback_interval?: string,
}
export async function getPreviousMessages({user_id, from_handle, lookback_interval}:GetPreviousMessageParams): Promise<Message[]> {
  const {rows: messages} = await db.file<Message>('db/messages/get_previous.sql', {user_id, from_handle, lookback_interval});
  return messages;
}

export async function getMessagesByUserId(user_id:string): Promise<Message[]> {
  const {rows: messages} = await db.file<Message>('db/messages/get_by_user_id.sql', {user_id});
  return messages;
}
