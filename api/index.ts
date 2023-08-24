import express from 'express';

import db from '../db';
import auth from '../controllers/authentication';
import { ApplicationError } from '../lib/applicationError';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  const {rows: [{now: time}]} = await db.query('SELECT NOW()');
  res.send(`current database time: ${time}`);
});

router.post('/register', async (req, res) => {
  try {
    const user = await auth.register(req.body);
    res.status(201).json(user);
  } catch(err) {
    if(err instanceof ApplicationError && err.statusCode) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.status(500).send(auth.AUTHENTICATION_ERRORS.REGISTER_ERROR);
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await auth.login(req.body);
    res.status(201).json(user);
  } catch(err) {
    if(err instanceof ApplicationError && err.statusCode) {
      res.status(err.statusCode).send(err.message);
    } else {
      console.error(err);
      res.status(auth.AUTHENTICATION_ERRORS.UNAUTHORIZED.statusCode).send(auth.AUTHENTICATION_ERRORS.UNAUTHORIZED.message);
    }
  }
});

router.post("/welcome", verifyToken, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

export = router;
