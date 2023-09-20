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
  setUser?: React.Dispatch<any>,
  persist: boolean,
  setPersist?: React.Dispatch<any>,
  signIn?: (prop:SignInProps) => Promise<boolean>,
  signOut?: () => Promise<void>,
};

