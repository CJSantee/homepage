import db from '../db';
import { ApplicationError } from '../lib/applicationError';
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

export async function getAllUsers() {
  const {rows: users} = await db.file('db/users/get.sql');
  return users;
}
