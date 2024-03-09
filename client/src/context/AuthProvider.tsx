import React, { createContext, useEffect, useState } from "react";
import {AuthContextType, User} from "../@types/auth";
import api from "../utils/api";

export const AuthContext = createContext<AuthContextType>({user: null, persist: false});

interface Props {
  children: React.ReactNode,
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
      username: username.trim(),
      password,
    };

    const {data, success, error} = await api.post('/auth', body);
    if(success) {
      const {username, user_id, acl} = data;
      setUser({user_id, username, acl});
      setPersist(rememberMe);
    } else {
      setPersist(false);
    }
    return {success, error};
  }

  const signUp: AuthContextType["signUp"] = async ({username, password, code}) => {
    const {data, success, error} = await api.post('/users', {username, password, code: `${code}`.toLowerCase()});
    if(success) {
      const {username, user_id, acl} = data;
      setUser({user_id, username, acl});
      setPersist(true);
    } else {
      setPersist(false);
    }
    return {success, error};
  }

  const signOut: AuthContextType["signOut"] = async () => {
    const {success} = await api.delete('/auth');
    if(success) {
      setUser(null);
      setPersist(null);
    }
  }
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        setUser,
        persist,
        setPersist,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
