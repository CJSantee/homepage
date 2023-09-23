import jwt from 'jsonwebtoken';
import auth from '../controllers/authentication';

const {SECRET_KEY} = process.env;

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if(!token) {
    console.log('Missing token.');
    return res.status(401).send('Invalid token.');
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch(err) {
    return res.status(401).send('Invalid token.');
  }
  if(next) {
    next();
  }
}

export const confirmPermission = (permission) => {
  return async (req, res, next) => {
    await verifyToken(req, res, null);
    // If verifyToken sent the headers, return
    if(res.headersSent) {
      return;
    }
    const {user_id} = req.user;
    if(await auth.hasPermission(user_id, permission)) {
      next();
    } else {
      return res.status(401).send('You do not have permission for this action.');
    }
  };
}
