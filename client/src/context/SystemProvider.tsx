import { createContext, useEffect, useState } from "react";
import { SystemContextType } from "../../@types/system";
import api from "../utils/api";

export const SystemContext = createContext<SystemContextType>({show_create_admin: false});

interface Props {
  children: React.ReactNode,
};
const SystemProvider: React.FC<Props> = ({ children }) => {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  useEffect(() => {
    console.log('SystemProvider')
    const getSystemParams = async () => {
      const {data, success} = await api.get('/');
      console.log('data', data);
      if(success) {
        const {sys_params} = data;
        setShowCreateAdmin(sys_params.show_create_admin);
      }
    }
    getSystemParams();
  }, []);

  return (
    <SystemContext.Provider value={{show_create_admin: showCreateAdmin}}>
      {children}
    </SystemContext.Provider>
  )
}

export default SystemProvider;