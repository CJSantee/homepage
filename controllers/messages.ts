import db from "../db";
import Message, { MessageParams } from "../types/models/message";

export async function insertMessage(message:MessageParams): Promise<Message> {
  const {rows: [dbMessage]} = await db.file('db/messages/put.sql', message);
  return dbMessage;
}
