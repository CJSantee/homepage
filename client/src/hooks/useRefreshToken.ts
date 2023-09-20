import api from "../utils/api";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setUser, setPersist } = useAuth();

  const refresh = async () => {
    const { data: user, success } = await api.get("/refresh");
    if(!success) {
      if(setPersist) setPersist(false);
      return;
    }
    if(setUser) setUser(user);
  }
  
  return refresh;
};
