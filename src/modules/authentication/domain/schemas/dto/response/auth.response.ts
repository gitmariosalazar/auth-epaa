import { RolOrPermission } from '../../../../../../shared/interfaces/RolOrPermission';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    username: string;
    email: string;
    roles: RolOrPermission[];
    permissions: RolOrPermission[];
    firstName: string;
    lastName: string;
    isActive: boolean;
    cardId?: string;
    isNaturalPerson?: boolean;
  };
}
