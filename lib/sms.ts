import { getPreviousMessage, insertMessage } from "../controllers/messages";
import { getUserByHandle } from "../controllers/users";
import { getWordle, insertUserWordle, insertWordle, parseWordleResults } from "../controllers/wordle";
import db from "../db";
import Message, { MessageParams } from "../types/models/message";
import twilio from "twilio";
import turdle from "./turdle";

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

  const user = await getUserByHandle(to_handle);
  if(!user) {
    // User doesn't exist or is blocked (opt-out)
    return;
  }

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

export async function receiveMessage(incomingMessage: MessageParams): Promise<{response:string, follow_up: string, outgoing_message_id: string}> {
  const {
    message,
    to_handle = TWILIO_TOLL_FREE_NUMBER,
    from_handle,
    user_id,
    x_message_id,
  } = incomingMessage;
  if(!message) {
    throw new Error('Missing message content');
  }
  if(!user_id) {
    throw new Error('Missing user_id');
  }

  const {message_id: incoming_message_id} = await insertMessage({
    message,
    direction: 'INCOMING',
    to_handle,
    from_handle,
    user_id,
    x_message_id,
  });
  console.log('Info: Received message from:', from_handle);

  const promptRegex = /^([A-z]+)\s*$/
  const [prompt]  = message.match(promptRegex)?.slice(1) || [false];
  let promptMsg = '';
  if(typeof prompt === 'string' && ['wordle', 'stop'].includes(prompt.toLowerCase())) {
    console.log('prompt', prompt);
  }

  // Check if message is wordle results
  let wordleResultsMsg;
  try {
    parseWordleResults(message);
    // If an error is not thrown Wordle Results have been sent
    wordleResultsMsg = true;
  } catch(err) {
    wordleResultsMsg = false;
  }

  // Check if message is a single Wordle
  const wordleRegex = /^([A-z]{5})\s*$/;
  const [wordleMsg]  = message.match(wordleRegex)?.slice(1) || [false];
  
  let response = '';
  let follow_up = '';
  if(typeof wordleMsg === 'string') {
    const {message: previousMessage} = await getPreviousMessage(incoming_message_id);
    const {wordle_number} = parseWordleResults(previousMessage);
    await insertWordle({wordle: wordleMsg, wordle_number});
  } else if(wordleResultsMsg) {
    try {
      const userWordle = await insertUserWordle(user_id, message);
      response = turdle.respondToUserWordle(userWordle);

      const {wordle_number} = userWordle;
      const wordle = await getWordle(wordle_number);
      if(!wordle) {
        follow_up = turdle.REQUEST_WORDLE;
      }
    } catch(err:any) {
      if(err.code === 'WORDLE_ALREADY_SUBMITTED') {
        response = turdle[err.code];
      } else {
        throw err;
      }
    }
  } else {
    response = turdle['INVALID_RESULTS'];
  }

  // Document outgoing message
  const {message_id: outgoing_message_id} = await insertMessage({
    message: response,
    direction: 'OUTGOING',
    to_handle: from_handle,
    from_handle: to_handle,
    user_id,
    parent_message_id: incoming_message_id,
  });

  return {response, follow_up, outgoing_message_id};
}