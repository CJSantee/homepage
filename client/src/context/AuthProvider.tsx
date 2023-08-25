import React, { createContext, useEffect, useState } from "react";
import {AuthContextType, User} from "../../@types/auth";
import api from "../utils/api";

export const AuthContext = createContext<AuthContextType | null>(null);

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

  const login: AuthContextType["login"] = async ({ username, password, rememberMe }) => {
    console.log('auth.login');
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
  
  return (
    <AuthContext.Provider 
      value={{
        token,
        user,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;