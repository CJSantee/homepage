import express, { Request } from 'express';
import auth from '../controllers/authentication';
import { confirmPermission, verifyToken } from '../middleware/auth';
import { addUserHandle, archiveUser, createUser, filterUserFieldsByAcl, getAllUsers, getUser, updateUser } from '../controllers/users';
import { AUTHENTICATION_ERRORS, ApplicationError } from '../lib/applicationError';

const isDevelopment = process.env.NODE_ENV === 'development';

const router = express.Router();


router.route('/')
  .get(verifyToken, async (req: Request<{}, {}, {}, {acl?: string}>, res, next) => {
    const {acl: search_acl} = req.query;
    const {acl, user_id} = req.user || {};
    try {
      if(!acl) throw new ApplicationError(AUTHENTICATION_ERRORS.UNAUTHORIZED);
      const sortRequestUserFirst = (a, _) => a.user_id === user_id ? -1 : 0;
      const users = await getAllUsers({acl: search_acl});
      const filteredUsers = filterUserFieldsByAcl(users, acl).sort(sortRequestUserFirst);
      res.status(200).json({users: filteredUsers});
    } catch(err) {
      next(err);
    }
  })  
  .post(async (req, res, next) => {
    const {password, code} = req.body;
    try {
      let user;
      if(password) {
        // Register user
        const {user: newUser, token} = await auth.register(req.body);
  
        res.cookie('jwt', token, {
          secure: !isDevelopment,
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 7 * 2), // ms * sec * min * hr * day * wk * 2 (2 weeks)
        });

        user = newUser;
      } else {
        // TODO: Should either protect this with permissions or move to a different route
        // Create new unverified user
        user = await createUser(req.body);
      }

      res.status(201).json(user);
    } catch(err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const {handle} = req.body;
      if(handle) {
        await addUserHandle(req.body);
        res.status(200).send('Added User Handle.');
      } else {
        const user = await updateUser(req.body);
        res.status(200).json(user);
      }
    } catch(err) {
      next(err);
    }
  })

router.route('/:username')
  .all(verifyToken)
  .get(async (req, res, next) => {
    const {username} = req.params;
    try {
      const user = await getUser({username});
      res.status(200).json(user);
    } catch(err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    const {username} = req.params;
    try {
      const {user_id} = await getUser({username}); 
      const user = await updateUser({...req.body, user_id});
      res.status(200).json(user);
    } catch(err) {
      next(err);
    }
  })
  .delete(confirmPermission('admin'), async (req, res, next) => {
    const {username} = req.params;
    try {
      const {user_id} = await getUser({username});
      await archiveUser(user_id);
      res.status(200).send('User Archived.');
    } catch(err) {
      next(err);
    }
  });

export = router;
