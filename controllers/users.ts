import db from '../db';
import { ApplicationError } from '../lib/applicationError';
import User from '../types/models/user';
import auth from './authentication';

export async function createUser({username}:{username:string}) {
  try {
    const {rows: [user]} = await db.file('db/users/put.sql', {username});
    return user;
  } catch(err: any) {
    if(err.constraint == 'unique_username') {
      throw new ApplicationError(auth.AUTHENTICATION_ERRORS.USERNAME_IN_USE);
    }
    throw err;
  }
}

export async function getUserById(user_id): Promise<User> {
  const {rows: [user]} = await db.file('db/users/get.sql', {user_id});
  return user;
}

export async function updateUser({user_id, username}:{user_id:string, username:string}) {
  const {rows: [user]} = await db.file('db/users/update.sql', {user_id, username});
  return user;
}

export async function addUserHandle({user_id, handle, protocol}) {
  // TODO: Add validation
  await db.file('db/user_handles/put.sql', {user_id, handle, protocol});
}

export async function archiveUser(user_id:string) {
  await db.file('db/users/archive.sql', {user_id});
}

export async function getAllUsers() {
  const {rows: users} = await db.file('db/users/get.sql');
  return users;
}

export async function getUserByHandle(handle:string) {
  const {rows: [user]} = await db.file('db/users/get_by_handle.sql', {handle});
  return user;
}
