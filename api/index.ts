import express from 'express';

import db from '../db';
import auth from '../controllers/authentication';

const router = express.Router();

router.get('/', async (req, res) => {
  const {rows: [{now: time}]} = await db.query('SELECT NOW()');
  res.send(`current database time: ${time}`);
});

router.post('/register', async (req, res) => {
  try {
    await auth.register(req.body);
    res.status(200).send('User created.');
  } catch(err) {
    console.error(err);
    res.status(500).send('An unexpected error occurred.');
  }
});

router.post('/login', async (req, res) => {

});

export = router;
