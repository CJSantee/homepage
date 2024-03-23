import bcrypt from 'bcrypt';
import db from '../db';
import { ApplicationError, AUTHENTICATION_ERRORS } from '../lib/applicationError';
import User, { UserIdentifiers } from '../types/models/user';
import { aclHasPermission } from '../utils';

const {ENCRYPTION_ROUNDS} = process.env;

// Map of referral codes to acls
export const REFERRAL_CODES = {
  pool: 'pool',
};

export async function getUser(params:UserIdentifiers): Promise<User&{password:string}> {
  const {rows: [user]} = await db.file<User&{password:string}>('db/users/get.sql', params);
  return user;
}

interface CreateParams {
  username: string,
  password?: string,
  code?: string,
}
export async function createUser({username, password, code}:CreateParams) {
  try {
    if(!username) {
      throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_REQUIRED);
    }

    const existingUser = await getUser({username});
    if(existingUser) {
      throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_IN_USE);
    }

    if(code && !REFERRAL_CODES[code]) {
      throw new ApplicationError(AUTHENTICATION_ERRORS.INVALID_CODE);
    }

    let hashedPasword;
    if(password) {
      hashedPasword = await bcrypt.hash(password, Number(ENCRYPTION_ROUNDS));
    }

    const {rows: [user]} = await db.file<{user_id: string, username: string}>('db/users/put.sql', {username, password: hashedPasword});
    
    let acl;
    if(code) {
      const {rows: [{acl: dbAcl}]} = await db.file<{acl: string}>('db/acls/put.sql', {user_id: user.user_id, acl: REFERRAL_CODES[code]});
      acl = dbAcl;
    }

    return {...user, acl};
  } catch(err: any) {
    if(err.constraint == 'unique_username') {
      throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_IN_USE);
    }
    throw err;
  }
}

interface UpdateParams {
  user_id: string,
  username?: string,
  oldPassword?: string,
  newPassword?: string,
}
export async function updateUser({user_id, username, oldPassword, newPassword}:UpdateParams) {
  let password;
  if(newPassword) {
    const {password: encrypted} = await getUser({user_id});
    if(!oldPassword || !await bcrypt.compare(oldPassword, encrypted)) {
      throw new ApplicationError(AUTHENTICATION_ERRORS.INCORRECT_PASSWORD);
    }
    password = await bcrypt.hash(newPassword, Number(ENCRYPTION_ROUNDS));
  } else if(newPassword === '') {
    console.log('HERE');
    password = '';
  }

  try {
    await db.file<User>('db/users/update.sql', {user_id, username, password});
  } catch(err: any) {
    if(err.constraint == 'unique_username') {
      throw new ApplicationError(AUTHENTICATION_ERRORS.USERNAME_IN_USE);
    }
  }
  return getUser({user_id, username});
}

export async function addUserHandle({user_id, handle, protocol}) {
  // TODO: Add validation
  await db.file<null>('db/user_handles/put.sql', {user_id, handle, protocol});
}

export async function archiveUser(user_id:string) {
  await db.file<null>('db/users/archive.sql', {user_id});
}

export async function getAllUsers(searchParams: {acl?: string} = {}) {
  const {rows: users} = await db.file<User>('db/users/get.sql');
  let filteredUsers = users;
  if(searchParams.acl) {
    filteredUsers = users.filter(user => aclHasPermission(`${user.acl}`, `${searchParams.acl}`))
  }
  return filteredUsers;
}

export async function getUserByHandle(handle:string) {
  const {rows: [user]} = await db.file('db/users/get_by_handle.sql', {handle});
  return user;
}

export async function blockUserHandle(handle:string) {
  await db.file('db/user_handles/block.sql', {handle});
}

/**
 * @description Filters the fields to include depending on the requesting user's acl
 */
export function filterUserFieldsByAcl(users:User[], acl:string) {
  const fieldPermissions = {
    acl: 'admin',
    handle: 'admin',
    skill_level: 'pool',
    password: 'none',
  };
  return users.reduce<any>((filteredUsers, user) => {
    const filteredUser = {};
    Object.keys(user).forEach((field) => {
      if(!fieldPermissions[field] || (fieldPermissions[field] !== 'none' && aclHasPermission(acl, fieldPermissions[field]))) {
        filteredUser[field] = user[field];
      }
    });
    filteredUsers.push(filteredUser);
    return filteredUsers;
  }, []);
}
