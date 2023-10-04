import express from 'express';
import { verifyToken } from '../middleware/auth';
import { insertUserWordle, getUserWordleStats, getWordleLeaderboard } from '../controllers/wordle';
import { getUserById } from '../controllers/users';
import { ApplicationError } from '../lib/applicationError';
import turdle from '../lib/turdle';
import { sendMessage } from '../lib/sms';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  // req.user will always be defined because of verifySmsUser
  const {user_id} = req.user || {user_id: '-1'};
  const stats = await getUserWordleStats(user_id);
  res.status(200).json(stats);
});

router.post('/', verifyToken, async (req, res, next) => {
  // req.user will always be defined because of verifySmsUser
  const {user_id} = req.user || {user_id: '-1'};
  const {results} = req.body;
  try {
    await insertUserWordle(user_id, results);
    const stats = await getUserWordleStats(user_id);
    res.status(201).json(stats);
  } catch(err) {
    next(err);
  }
});

router.post('/invite', verifyToken, async (req, res, next) => {
  // req.user will always be defined because of verifySmsUser
  const {user_id} = req.body;
  try {
    const {username, handle} = await getUserById(user_id);
    if(!handle) {
      throw new ApplicationError({
        type: ApplicationError.TYPES.CLIENT,
        code: 'MISSING_USER_HANDLE',
        message: 'User does have have a user_handle row',
        statusCode: 400,
        statusMessage: 'User does not have an associated phone number',
      });
    }
    const message = turdle.INVITE({username});
    await sendMessage({message, to_handle: handle, user_id});
    res.status(200).json('Invite sent!');
  } catch(err) {
    next(err);
  }
});

router.get('/leaderboard', async (req, res, next) => {
  try {
    const leaderboard = await getWordleLeaderboard();
    res.status(200).json(leaderboard);
  } catch(err) {
    next(err);
  }
});

export = router;
