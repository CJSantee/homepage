import express from 'express';
import twilio from 'twilio';
import { insertUserWordle, parseWordleResults } from '../controllers/wordle';
import { receiveMessage } from '../lib/sms';
import { verifySmsUser } from '../middleware/auth';
import turdle from '../lib/turdle';
import { insertMessage } from '../controllers/messages';
import { MessageParams } from '../types/models/message';
const { MessagingResponse } = twilio.twiml;

const router = express.Router();

const {NODE_ENV} = process.env;
const isDevelopment = NODE_ENV === 'development';

router.route('/incoming')
  .post(twilio.webhook({validate: !isDevelopment}), verifySmsUser, async (req, res, next) => {
    const {MessageSid, From, To, Body} = req.body;
    // req.user will always be defined because of verifySmsUser
    const {user_id} = req.user || {user_id: '-1'}; 

    try {
      const incomingMessage: MessageParams = {
        message: Body,
        to_handle: To,
        from_handle: From,
        user_id,
        x_message_id: MessageSid,
      };
      const {message_id: parent_message_id} = await receiveMessage(incomingMessage);

      let wordleResultsMsg;
      try {
        parseWordleResults(Body);
        // If an error is not thrown Wordle Results have been sent
        wordleResultsMsg = true;
      } catch(err) {
        wordleResultsMsg = false;
      }

      let response = '';
      if(wordleResultsMsg) {
        try {
          const userWordle = await insertUserWordle(user_id, Body);
          response = turdle.respondToUserWordle(userWordle);
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
      await insertMessage({
        message: response,
        direction: 'OUTGOING',
        to_handle: From,
        from_handle: To,
        user_id,
        parent_message_id,
      })

      if(isDevelopment) {
        res.status(200).send(response);
      } else {
        const twiml = new MessagingResponse();
        twiml.message(response);
        res.type('text/xml').send(twiml.toString());
      }
    } catch(err) {
      next(err);
    }
  });

export = router;
