import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";


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
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        <Spinner animation="border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <Outlet />
    )
  );
}

export default PersistLogin;