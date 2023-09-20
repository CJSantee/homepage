import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthRoute({ acl }:{acl?: string}) {
  const auth = useAuth();
  const location = useLocation();

  // Not logged in
  if (!auth.user) {
    return <Navigate to='/' state={{ from: location }} />;
  }

  return <Outlet />;
}
