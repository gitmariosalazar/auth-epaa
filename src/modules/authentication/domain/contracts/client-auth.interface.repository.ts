import { ClientUserModel } from '../schemas/models/client-user.model';
import { RefreshTokenModel } from '../schemas/models/refresh-token.model';

export interface InterfaceClientAuthRepository {
  findClientByEmail(email: string): Promise<ClientUserModel | null>;
  findClientByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<ClientUserModel | null>;
  findClientById(id: string): Promise<ClientUserModel | null>;
  storeRefreshToken(refreshToken: RefreshTokenModel): Promise<boolean>;
  logClientAccess(
    clientUserId: string | null,
    usernameOrEmail: string,
    event: string,
    ip: string,
    userAgent: string,
    reason?: string | null,
  ): Promise<void>;
}
