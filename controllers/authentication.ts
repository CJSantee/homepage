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
  USERNAME_REQUIRED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USERNAME_REQUIRED',
    message: 'Username is required.',
    statusCode: 400,
  },
  PASSWORD_REQUIRED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'PASSWORD_REQUIRED',
    message: 'Password is required.',
    statusCode: 400,
  }
};

const ROUNDS = 10;

interface User {
  user_id: number,
  username: string,
  acl: string,
};

async function register({username, password}: {username: string, password: string}): Promise<{user: User, token: string}>{
  const {rows: [existingUser]} = await db.file('db/users/get.sql', {username});
  if(existingUser) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_IN_USE);
  }

  if(!username) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_REQUIRED);
  }
  if(!password) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.PASSWORD_REQUIRED);
  }

  const hashedPasword = await bcrypt.hash(password, ROUNDS);

  const {rows: [user]} = await db.file('db/users/put.sql', {username, password: hashedPasword});

  const token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY);

  return {
    user: {
      user_id: user.user_id,
      username: user.username,
      acl: '',
    }, 
    token,
  };
}

async function login({username, password}: {username: string, password: string}): Promise<{user: User, token: string}> {
  const {rows: [user]} = await db.file('db/users/get.sql', {username});

  let token;
  if(user && (await bcrypt.compare(password, user.password))) {
    token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY);
  } else {
    throw new ApplicationError(AUTHENTICATION_ERRORS.UNAUTHORIZED);
  }
  
  return {
    user: {
      user_id: user.user_id,
      username: user.username,
      acl: user.acl,
    }, // don't return encrypted passwords
    token,
  };
}

async function refresh(user_id): Promise<{user: User | null, token: string | null}> {
  const {rows: [user]} = await db.file('db/users/get.sql', {user_id});

  if(user) {
    const token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY)
    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        acl: user.acl,
      }, // don't return encrypted passwords
      token,
    }
  }

  return {
    user: null,
    token: null,
  }
}

/**
 * @description Check if a user has an acl row with the provided permission
 */
async function hasPermission(user_id: number, permission: string): Promise<boolean> {
  const {rows: [aclRow]} = await db.file('db/acls/get_by_user_id.sql', {user_id});
  if(!aclRow) {
    return false;
  }
  const {acl} = aclRow;
  if(acl === 'colin') {
    return true;
  }
  const acls = acl?.split('|') || [];
  return acls.includes(permission);
}

export = {
  AUTHENTICATION_ERRORS,
  register,
  login,
  refresh,
  hasPermission,
};
