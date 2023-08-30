import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";


function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { persist, user } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      await refresh();
      setIsLoading(false);
    }
    !user && persist ? verifyRefreshToken() : setIsLoading(false);
  }, [user, persist, refresh]);

  return (
    !persist ? (
      <Outlet />
    ) : isLoading ? (
      <div>LOADING</div>
    ) : (
      <Outlet />
    )
  );
}

export default PersistLogin;