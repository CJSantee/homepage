import express, { Request } from 'express';
import db from '../db';
import auth from '../controllers/authentication';
import { confirmPermission, verifyToken } from '../middleware/auth';
import { addUserHandle, createUser, filterUserFieldsByAcl, getAllUsers, updateUser } from '../controllers/users';

import userApi from './users';
import wordleApi from './wordle';
import messageApi from './message';
import smsApi from './sms';
import poolApi from './pool';

const isDevelopment = process.env.NODE_ENV === 'development';

const router = express.Router();

router.get('/', async (req, res) => {
  const {rows: [{now: time}]} = await db.query('SELECT NOW()');
  const {rows: [sys_params]} = await db.file<any>('db/sys_params/get.sql');
  res.status(200).json({time, sys_params});
});

router.route('/auth')
  .post(async (req, res, next) => {
    try {
      const {user, token} = await auth.login(req.body);

      res.cookie('jwt', token, {
        secure: !isDevelopment,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 7 * 2), // ms * sec * min * hr * day * wk * 2 (2 weeks)
      });
  
      res.status(200).json(user);
    } catch(err) {
      next(err);
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
  res.status(200).json(user);
});

router.post('/welcome', verifyToken, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

router.use('/users', userApi);
router.use('/sms', smsApi);
router.use('/message', messageApi);
router.use('/wordle', wordleApi);
router.use('/pool', poolApi);

export = router;
