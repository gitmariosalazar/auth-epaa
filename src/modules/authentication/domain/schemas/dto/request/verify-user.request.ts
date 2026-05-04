export class VerifyUserRequest {
  username_or_email: string;

  constructor(username_or_email: string) {
    this.username_or_email = username_or_email;
  }
}
