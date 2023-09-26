import db from "../db";
import Message, { MessageParams } from "../types/models/message";
import twilio from "twilio";

const {NODE_ENV, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = process.env;
const isDevelopment = NODE_ENV === 'development';

const twilioClient = twilio(
  TWILIO_ACCOUNT_SID || 'AC',
  TWILIO_AUTH_TOKEN || 'password',
);

const TWILIO_TOLL_FREE_NUMBER = '+18555040561';

export async function sendMessage(outgoingMessage: MessageParams) {
  const {
    message,
    to_handle = '',
    from_handle = TWILIO_TOLL_FREE_NUMBER,
    user_id, 
  } = outgoingMessage;
  let x_message_id;
  if(!isDevelopment) {
    const {sid} = await twilioClient.messages.create({
      from: from_handle,
      to: to_handle,
      body: message,
    });
    x_message_id = sid;
    console.log('Info: Message sent to:', to_handle);
  } else {
    console.log('Message not sent in development:', message);
  }
  await db.file('db/messages/put.sql', {
    message,
    direction: 'OUTGOING',
    to_handle,
    from_handle,
    user_id,
    x_message_id,
  });
}

export async function receiveMessage(incomingMessage: MessageParams): Promise<Message> {
  const {
    message,
    to_handle = TWILIO_TOLL_FREE_NUMBER,
    from_handle,
    user_id,
    x_message_id,
  } = incomingMessage;
  const {rows: [dbMessage]} = await db.file('db/messages/put.sql', {
    message,
    direction: 'INCOMING',
    to_handle,
    from_handle,
    user_id,
    x_message_id,
  });
  console.log('Info: Received message from:', from_handle);
  return dbMessage;
}