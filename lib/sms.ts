import { getPreviousMessages, insertMessage } from "../controllers/messages";
import { blockUserHandle, getUserByHandle } from "../controllers/users";
import { getWordle, insertUserWordle, insertWordle, parseWordleResults } from "../controllers/wordle";
import db from "../db";
import { MessageParams } from "../types/models/message";
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

type Response = {
  response: string,
  follow_up: string,
  outgoing_message_id?: string
};
export async function receiveMessage(incomingMessage: MessageParams): Promise<Response> {
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
  if(!from_handle) {
    throw new Error('Missing message handle');
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

  const getPromptResponse = async ():Promise<Response> => {
    const promptRegex = /^([A-z]+)\s*$/
    const [promptMsg]  = message.match(promptRegex)?.slice(1) || [false];

    const prompts = ['WORDLE', 'STOP'];
    if(typeof promptMsg === 'string' && prompts.includes(promptMsg.toUpperCase())) {
      let promptResponse = '';
      // Handle prompts
      switch (promptMsg.toUpperCase()) {
        case 'WORDLE':
          promptResponse = turdle['OPT_IN'];
          break;
        case 'STOP':
          await blockUserHandle(from_handle);
          promptResponse = turdle['OPT_OUT'];
          break;
      }
      return {
        response: promptResponse,
        follow_up: '',
      }
    } else {
      return {
        response: '',
        follow_up: '',  
      }
    }
  }

  const getWordleResponse = async ():Promise<Response>  => {
    const wordleRegex = /^([A-z]{5})\s*$/;
    const [wordleMsg]  = message.match(wordleRegex)?.slice(1) || [false];
    if(typeof wordleMsg === 'string') {
      const sessionMessages = await getPreviousMessages({user_id, from_handle, lookback_interval: '1 hour'});
      let wordleNumber;
      // Look for previous wordle results message to find the wordle_number
      sessionMessages.every(m => {
        try {
          const {wordle_number} = parseWordleResults(m);
          wordleNumber = wordle_number;
          return false;
        } catch(err) {
          return true;
        }
      });
      if(wordleNumber) {
        await insertWordle({wordle: wordleMsg, wordle_number: wordleNumber});
        return {
          response: turdle['WORDLE_RECEIVED'],
          follow_up: '',
        }
      }
    }
    return {
      response: '',
      follow_up: '',
    }
  }
  
  const getWordleResultsResponse = async ():Promise<Response> => {
    // Check if message is wordle results
    let wordleResultsMsg;
    try {
      parseWordleResults(message);
      // If an error is not thrown Wordle Results have been sent
      wordleResultsMsg = true;
    } catch(err) {
      wordleResultsMsg = false;
    }

    if(wordleResultsMsg) {
      let wordleResultsResponse = '';
      let wordleResultsFollowUp = '';

      try {
        const userWordle = await insertUserWordle(user_id, message);
        wordleResultsResponse = turdle.respondToUserWordle(userWordle);
  
        const {wordle_number} = userWordle;
        const wordle = await getWordle(wordle_number);
        if(!wordle) {
          wordleResultsFollowUp = turdle.REQUEST_WORDLE;
        }
      } catch(err:any) {
        if(err.code === 'WORDLE_ALREADY_SUBMITTED') {
          wordleResultsResponse = turdle[err.code];
        } else {
          throw err;
        }
      }

      return {
        response: wordleResultsResponse,
        follow_up: wordleResultsFollowUp,
      }
    } else {
      return {
        response: turdle['INVALID_RESULTS'],
        follow_up: '',
      }
    }
  }

  let response = '';
  let follow_up = '';

  ({response, follow_up} = await getPromptResponse());
  if(!response && !follow_up) {
    ({response, follow_up} = await getWordleResponse());
  }
  if(!response && !follow_up) {
    ({response, follow_up} = await getWordleResultsResponse());
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