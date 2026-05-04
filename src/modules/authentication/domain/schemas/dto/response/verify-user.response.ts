export interface VerifyUserResponse {
  exists: boolean;
  userId?: string;
  username?: string;
  email?: string;
  isActive?: boolean;
}
