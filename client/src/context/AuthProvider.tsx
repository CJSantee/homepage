import React, { createContext, useEffect, useState } from "react";
import {AuthContextType} from "../../@types/auth";

export const AuthContext = createContext<AuthContextType |  null>(null);

interface Props {
  children: React.ReactNode,
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [auth, setAuth] = useState({});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <AuthContext.Provider 
      value={{
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;