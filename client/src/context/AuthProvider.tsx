import React, { createContext, useEffect, useState } from "react";
import {AuthContextType, User} from "../../@types/auth";
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
      username,
      password,
    };

    const {data, success} = await api.post('/auth', body);
    if(success) {
      const {username, user_id, acl} = data;
      setUser({user_id, username, acl});
      setPersist(rememberMe);
    } else {
      setPersist(false);
    }
    return success;
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
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;