import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { ApplicationError } from '../lib/applicationError';

const {SECRET_KEY} = process.env;

const AUTHENTICATION_ERRORS = {
  USERNAME_IN_USE: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USERNAME_IN_USE',
    message: 'This username is already in use.',
    statusCode: 400,
  },
  REGISTER_ERROR: {
    type: ApplicationError.TYPES.SERVER,
    code: 'REGISTRATION_FAILED',
    message: 'An unexpected error occurred, please try agin.',
    statusCode: 500,
  },
  UNAUTHORIZED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USER_UNAUTHORIZED',
    message: 'Invalid login.',
    statusCode: 401,
  },
};

const ROUNDS = 10;

interface User {
  user_id: number,
  username: string,
  token: string,
};

async function register({username, password}: {username: string, password: string}): Promise<User>{
  const {rows: [existingUser]} = await db.file('db/users/get.sql', {username});
  if(existingUser) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_IN_USE);
  }

  const hashedPasword = await bcrypt.hash(password, ROUNDS);

  const {rows: [newUser]} = await db.file('db/users/put.sql', {username, password: hashedPasword});

  const token = jwt.sign({username}, SECRET_KEY);
  newUser.token = token;

  return newUser;
}

async function login({username, password}: {username: string, password: string}): Promise<User> {
  const {rows: [user]} = await db.file('db/users/get.sql', {username});

  if(user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({username}, SECRET_KEY);
    user.token = token;
  } else {
    throw new ApplicationError(AUTHENTICATION_ERRORS.UNAUTHORIZED);
  }
  
  return {
    user_id: user.user_id,
    username: user.username,
    token: user.token,
  };
}

export = {
  AUTHENTICATION_ERRORS,
  register,
  login
};
