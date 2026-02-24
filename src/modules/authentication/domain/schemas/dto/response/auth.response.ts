export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
}
