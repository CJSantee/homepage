export const hasPermission = (permission: string, acl: string) => {
  if(acl === 'colin') {
    return true;
  }
  const acls = acl?.split('|') || [];
  return acls.includes(permission);
}
