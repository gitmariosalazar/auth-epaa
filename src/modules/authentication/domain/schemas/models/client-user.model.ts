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
}
