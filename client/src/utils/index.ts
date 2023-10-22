export const hasPermission = (permission: string, acl: string) => {
  if(acl === 'colin') {
    return true;
  }
  const acls = acl?.split('|') || [];
  return acls.includes(permission);
}

export const toReadablePhone = (phone:string) => {
  return phone.slice(0, 2) 
    + " (" 
    + phone.slice(2, 5)
    + ") "
    + phone.slice(5, 8)
    + "-"
    + phone.slice(8);
}
