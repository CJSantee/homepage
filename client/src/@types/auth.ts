export interface SignInProps {
  username: string,
  password: string,
  rememberMe: boolean,
};

export interface SignUpProps {
  username: string,
  password: string,
  code: string,
};

export interface User {
  user_id: string,
  username: string,
  acl: string,
};

export type AuthContextType = {
  user: User | null,
  setUser?: React.Dispatch<any>,
  persist: boolean,
  setPersist?: React.Dispatch<any>,
  signIn?: (props:SignInProps) => Promise<{success: boolean, error: any}>,
  signUp?: (props:SignUpProps) => Promise<{success: boolean, error: any}>,
  signOut?: () => Promise<void>,
};

