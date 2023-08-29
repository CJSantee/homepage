import React, { createContext, useEffect, useState } from "react";
import {AuthContextType, User} from "../../@types/auth";
import api from "../utils/api";

export const AuthContext = createContext<AuthContextType>({token: null, user: null});

interface Props {
  children: React.ReactNode,
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(null);
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist") || 'false')
  );

  // Update local storage with persist
  useEffect(() => {
    const curr = JSON.parse(localStorage.getItem("persist") || 'false');
    if(curr !== persist) {
      localStorage.setItem("persist", persist);
    }
  }, [persist]);

  const signIn: AuthContextType["signIn"] = async ({ username, password, rememberMe }) => {
    const body = {
      username,
      password,
    };

    const {data, success} = await api.post('/auth', body);
    if(success) {
      const {token, username, user_id} = data;
      setToken(token);
      setUser({user_id, username});
      setPersist(rememberMe);
    } else {
      setPersist(false);
    }
  }

  const signOut: AuthContextType["signOut"] = async () => {
    const {success} = await api.delete('/auth');
    if(success) {
      setToken(null);
      setUser(null);
      setPersist(null);
    }
  }
  
  return (
    <AuthContext.Provider 
      value={{
        token,
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;