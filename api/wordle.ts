import express from 'express';
import { verifyToken } from '../middleware/auth';
import { insertUserWordle, getUserWordleStats, getWordleLeaderboard } from '../controllers/wordle';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  const {user_id} = req.user || {};
  const stats = await getUserWordleStats(user_id);
  res.status(200).json(stats);
});

router.post('/', verifyToken, async (req, res, next) => {
  const {user_id} = req.user || {};
  const {results} = req.body;
  try {
    await insertUserWordle(user_id, results);
    const stats = await getUserWordleStats(user_id);
    res.status(201).json(stats);
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
