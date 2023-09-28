import express from 'express';
import twilio from 'twilio';
import { receiveMessage, sendMessage } from '../lib/sms';
import { verifySmsUser } from '../middleware/auth';
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

      const {response, follow_up, outgoing_message_id} = await receiveMessage(incomingMessage);

      if(isDevelopment) {
        res.status(200).send(response);
      } else {
        const twiml = new MessagingResponse();
        twiml.message(response);
        res.type('text/xml').send(twiml.toString());
      }

      if(follow_up) {
        setTimeout(() => {
          sendMessage({
            message: follow_up,
            to_handle: From,
            user_id,
            parent_message_id: outgoing_message_id,
          });
        }, 5000);
      }
    } catch(err) {
      next(err);
    }
  });

export = router;
