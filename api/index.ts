import express, { Request } from 'express';

import db from '../db';
import auth from '../controllers/authentication';
import { ApplicationError } from '../lib/applicationError';
import { verifyToken } from '../middleware/auth';

const isDevelopment = process.env.NODE_ENV === 'development';

const router = express.Router();

interface User {
  user_id: string,
  username: string,
};
interface AuthenticatedRequest extends Request {
  user: User,
};

router.get('/', async (req, res) => {
  const {rows: [{now: time}]} = await db.query('SELECT NOW()');
  res.send(`current database time: ${time}`);
});

router.post('/users', async (req, res) => {
  try {
    const {user, token} = await auth.register(req.body);

    res.cookie('jwt', token, {
      secure: !isDevelopment,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 7 * 2), // ms * sec * min * hr * day * wk * 2 (2 weeks)
    });

    res.status(201).json(user);
  } catch(err) {
    if(err instanceof ApplicationError && err.statusCode) {
      res.status(err.statusCode).send(err.message);
    } else {
      res.status(500).send(auth.AUTHENTICATION_ERRORS.REGISTER_ERROR);
    }
  }
});

router.route('/auth')
  .post(async (req, res) => {
    try {
      const {user, token} = await auth.login(req.body);

      res.cookie('jwt', token, {
        secure: !isDevelopment,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 7 * 2), // ms * sec * min * hr * day * wk * 2 (2 weeks)
      });
  
      res.status(200).json(user);
    } catch(err) {
      if(err instanceof ApplicationError && err.statusCode) {
        res.status(err.statusCode).send(err.message);
      } else {
        console.error(err);
        res.status(auth.AUTHENTICATION_ERRORS.UNAUTHORIZED.statusCode).send(auth.AUTHENTICATION_ERRORS.UNAUTHORIZED.message);
      }
    }
  })
  .delete(async (req, res) => {
    res.clearCookie('jwt');
    res.end();
  });

router.get('/refresh', verifyToken, async (req, res) => {
  const {user_id} = req.user || {};
  const {user, token: newToken} = await auth.refresh(user_id);
  res.cookie('jwt', newToken, {
    secure: !isDevelopment,
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 7 * 2), // ms * sec * min * hr * day * wk * 2 (2 weeks)
  });
  res.status(200).send(user);
});

router.post('/welcome', verifyToken, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

export = router;
