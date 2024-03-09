import { createContext, useEffect, useState } from "react";
import { SystemContextType } from "../@types/system";
import api from "../utils/api";

export const SystemContext = createContext<SystemContextType>({show_create_admin: false, offline: false});

interface Props {
  children: React.ReactNode,
};
const SystemProvider: React.FC<Props> = ({ children }) => {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const getSystemParams = async () => {
      const {data, success, error} = await api.get('/');
      if(success) {
        const {sys_params} = data;
        setShowCreateAdmin(sys_params?.show_create_admin);
      } else if(error.code === 'ERR_CONNECTION_REFUSED') {
        setOffline(true);
      }
    }
    getSystemParams();
  }, []);

  return (
    <SystemContext.Provider value={{show_create_admin: showCreateAdmin, offline}}>
      {children}
    </SystemContext.Provider>
  )
}

export default SystemProvider;