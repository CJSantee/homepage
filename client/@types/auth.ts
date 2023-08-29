export interface SignInProps {
  username: string,
  password: string,
  rememberMe: boolean,
};

export interface User {
  user_id: string,
  username: string,
};

export type AuthContextType = {
  token: string | null,
  user: User | null,
  signIn?: (prop:SignInProps) => Promise<void>,
  signOut?: () => Promise<void>,
};

