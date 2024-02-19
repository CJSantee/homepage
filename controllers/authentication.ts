import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { ApplicationError } from '../lib/applicationError';
import User from '../types/models/user';
import { getUser } from './users';
import { aclHasPermission } from '../utils';

const {SECRET_KEY} = process.env;

const AUTHENTICATION_ERRORS = {
  USERNAME_IN_USE: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USERNAME_IN_USE',
    message: 'Username already in use.',
    statusMessage: 'This username is already in use.',
    statusCode: 400,
  },
  REGISTER_ERROR: {
    type: ApplicationError.TYPES.SERVER,
    code: 'REGISTRATION_FAILED',
    message: 'Unexpected registration error',
    statusMessage: 'An unexpected error occurred, please try agin.',
    statusCode: 500,
  },
  UNAUTHORIZED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USER_UNAUTHORIZED',
    message: 'User is not authorized for this action.',
    statusMessage: 'Invalid login.',
    statusCode: 401,
  },
  USERNAME_REQUIRED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USERNAME_REQUIRED',
    message: 'User did not provide a username.',
    statusMessage: 'Username is required.',
    statusCode: 400,
  },
  PASSWORD_REQUIRED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'PASSWORD_REQUIRED',
    message: 'User did not provide a password.',
    statusMessage: 'Password is required.',
    statusCode: 400,
  },
  INVALID_CODE: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'INVALID_CODE',
    message: 'User provided an invalid referral code.',
    statusMessage: 'Invalid referral code.',
    statusCode: 400,
  },
};

// Map of referral codes to acls
const REFERRAL_CODES = {
  pool: 'pool',
};

const ROUNDS = 10;

// Used to ensure only these fields are returned for users
const transformUser = (user: User) => {
  return {
    user_id: user.user_id,
    username: user.username,
    acl: user?.acl,
    handle: user?.handle,
  };
}

/**
 * @description Register a new user
 */
async function register({username, password, code}: {username: string, password: string, code: string}): Promise<{user: User, token: string}>{
  const existingUser = await getUser({username});
  if(existingUser) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_IN_USE);
  }

  if(!username) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_REQUIRED);
  }
  if(!password) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.PASSWORD_REQUIRED);
  }
  if(!code || !REFERRAL_CODES[code]) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.INVALID_CODE);
  }

  const hashedPasword = await bcrypt.hash(password, ROUNDS);

  const {rows: [user]} = await db.file<{user_id: string, username: string}>('db/users/put.sql', {username, password: hashedPasword});
  const {rows: [{acl}]} = await db.file<{acl: string}>('db/acls/put.sql', {user_id: user.user_id, acl: REFERRAL_CODES[code]});

  const token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY);

  return {
    user: transformUser({...user, acl}),
    token,
  };
}

async function login({username, password}: {username: string, password: string}): Promise<{user: User, token: string}> {
  const user = await getUser({username});

  let token;
  if(user && (await bcrypt.compare(password, user.password))) {
    token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY);
  } else {
    throw new ApplicationError(AUTHENTICATION_ERRORS.UNAUTHORIZED);
  }
  
  return {
    user: transformUser(user),
    token,
  };
}

async function refresh(user_id): Promise<{user: User | null, token: string | null}> {
  const user = await getUser({user_id});

  if(user) {
    const token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY)
    return {
      user: transformUser(user),
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
async function hasPermission(user_id: string, permission: string): Promise<boolean> {
  const {rows: [aclRow]} = await db.file<{acl_id:string, user_id:string, acl:string}>('db/acls/get_by_user_id.sql', {user_id});
  if(!aclRow) {
    return false;
  }
  const {acl} = aclRow;
  return aclHasPermission(acl, permission);
}

export = {
  AUTHENTICATION_ERRORS,
  register,
  login,
  refresh,
  hasPermission,
};
