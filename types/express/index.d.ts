interface User {
  user_id: string,
  username: string,
};

export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}