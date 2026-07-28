export class ClientUserModel {
  clientUserId!: string;
  clienteId!: string;
  email!: string;
  passwordHash!: string;
  estadoClienteUsuarioId!: number;
  isActive!: boolean;
  isLockedOut!: boolean;
  lockoutUntil?: Date;
  firstName?: string;
  lastName?: string;
  roles: { id: number; name: string }[] = [];
  isNaturalPerson?: boolean;
}
