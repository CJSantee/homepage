export default interface User {
  user_id: string,
  username: string,
  acl?: string,
  handle?: string,
  password?: string,
};

export interface UserIdentifiers {
  user_id?: string,
  username?: string,
};
