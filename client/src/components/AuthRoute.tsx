import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../utils";

interface AuthRouteProps {
  permission: string,
}
function AuthRoute({ permission }:AuthRouteProps) {
  const auth = useAuth();
  const location = useLocation();

  // Not logged in
  if(!auth.user) {
    return <Navigate to='/' state={{ from: location }} />;
  }
  // Does not have the correct role
  if (!hasPermission(permission, auth.user.acl)) {
    return <Navigate to='/not-found' />;
  }

  return <Outlet />;
}

export default AuthRoute;
