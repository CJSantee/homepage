import jwt from 'jsonwebtoken';

const {SECRET_KEY} = process.env;

export const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if(!token) {
    console.log('Missing token.');
    return res.status(401).send('Invalid token.');
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch(err) {
    res.status(401).send('Invalid token.');
  }
  return next();
}