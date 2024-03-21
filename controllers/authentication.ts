import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import { ApplicationError, AUTHENTICATION_ERRORS } from '../lib/applicationError';
import User from '../types/models/user';
import { createUser, getUser } from './users';
import { aclHasPermission } from '../utils';

const {SECRET_KEY, ENCRYPTION_ROUNDS} = process.env;

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
  if(!password) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.PASSWORD_REQUIRED);
  }
  if(!code) {
    throw new ApplicationError(AUTHENTICATION_ERRORS.INVALID_CODE);
  }

  const user = await createUser({username, password, code});
  const token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY);

  return {
    user: transformUser(user),
    token,
  };
}

async function login({username, password}: {username: string, password: string}): Promise<{user: User, token: string}> {
  const user = await getUser({username});

  let token;
  if(user && !user.password) {
    // Update password
    const hashedPasword = await bcrypt.hash(password, Number(ENCRYPTION_ROUNDS));
    await db.file('db/users/update.sql', {user_id:  user.user_id, password: hashedPasword});
    token = jwt.sign({user_id: user.user_id, username: user.username}, SECRET_KEY);
  } else if(user && (await bcrypt.compare(password, user.password))) {
    // Login with password
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
  register,
  login,
  refresh,
  hasPermission,
};
