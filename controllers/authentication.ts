import db from '../db';

async function register({username, password} = {username: null, password: null}) {
  try {
    const {rows: [user]} = await db.file('db/users/get.sql', {username});
    if(user) {
      throw new Error('username is already is use.');
    }
  } catch(err) {
    console.error(err);
  }
}

function login() {

}

export = {
  register,
  login
};
