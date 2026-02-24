export class AuthRequest {
  username_or_email: string;
  password: string;

  constructor(username_or_email: string, password: string) {
    this.username_or_email = username_or_email;
    this.password = password;
  }
}
