import express from 'express';
import { ApplicationError } from '../lib/applicationError';
import { verifyToken } from '../middleware/auth';
import { insertUserWordle, getUserWordleStats } from '../controllers/wordle';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  const {user_id} = req.user || {};
  const stats = await getUserWordleStats(user_id);
  res.status(200).json(stats);
});

router.post('/', verifyToken, async (req, res) => {
  const {user_id} = req.user || {};
  const {results} = req.body;
  try {
    await insertUserWordle(user_id, results);
    res.status(201).send("Thanks for entering your wordle!");
  } catch(err) {
    if(err instanceof ApplicationError && err.statusCode) {
      res.status(err.statusCode).send(err.message);
    } else {
      console.error(err);
      res.status(500).send('An unexpected error occurred.');
    }

  }
});

export = router;
