import express from 'express';
import { verifyToken } from '../middleware/auth';
import { getMessagesByUserId } from '../controllers/messages';
import { receiveMessage } from '../lib/sms';

const router = express.Router();

router.route('/')
  .get(verifyToken, async (req, res, next) => {
    // req.user will always be defined because of verifySmsUser
    const {user_id} = req.user || { user_id: '-1' };
    try {
      const messages = await getMessagesByUserId(user_id);
      res.status(200).json(messages);
    } catch(err) {
      next(err);
    }
  })
  .post(verifyToken, async (req, res, next) => {
    // req.user will always be defined because of verifySmsUser
    const {user_id, handle} = req.user || { user_id: '-1', handle: '+11234567890' };
    const {message} = req.body;
    try {
      await receiveMessage({
        message,
        from_handle: handle,
        user_id
      });
  
      const messages = await getMessagesByUserId(user_id);
      res.status(200).json(messages);
    } catch(err) {
      next(err);
    }
  });

export = router;
