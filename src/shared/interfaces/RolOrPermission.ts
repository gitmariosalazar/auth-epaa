export interface RolOrPermission {
  id: number;
  name: string;
  description: string;
}

export const isAdmin = (roles: RolOrPermission[]) => {
  return roles.some(
    (r: RolOrPermission) =>
      r.name.toUpperCase() === 'SUPER ADMINISTRADOR' ||
      r.name.toUpperCase() === 'ADMINISTRADOR',
  );
};

export const isCustomer = (roles: RolOrPermission[]) => {
  return roles.some(
    (r: RolOrPermission) => r.name.toUpperCase() === 'ABONADO PORTAL WEB',
  );
};
