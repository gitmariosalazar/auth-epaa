export class UpdateUserRequest {
  username?: string;
  email?: string;

  constructor(
    username?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
  ) {
    this.username = username;
    this.email = email;
  }
}
