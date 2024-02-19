import { useAuth } from "../hooks/useAuth"
import { hasPermission } from "../utils";


interface Props {
  children: React.ReactNode,
  permission: string,
};

function AuthContainer({children, permission}:Props) {
  const auth = useAuth();

  if(!auth.user || !hasPermission(permission, auth.user?.acl)) {
    return (
      <></>
    );
  }

  return (
    <>
      {children}
    </>
  );
}

export default AuthContainer;
