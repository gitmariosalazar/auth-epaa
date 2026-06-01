export class CreateCustomerRequest {
  clientId!: string; // Cédula/RUC de cliente en la tabla cliente
  email!: string;
  password?: string;
  authMethod?: string; // e.g. PASSWORD, GOOGLE, etc.
  authProvider?: string;
  customerStatusId?: number; // 1: activo, 2: inactivo (default)
  createdBy?: string;
  firstName?: string;
  lastName?: string;
  nombreComercial?: string;
  razonSocial?: string;

  constructor(params?: {
    clientId: string;
    email: string;
    password?: string;
    authMethod?: string;
    authProvider?: string;
    customerStatusId?: number;
    createdBy?: string;
    firstName?: string;
    lastName?: string;
    nombreComercial?: string;
    razonSocial?: string;
  }) {
    if (params) {
      this.clientId = params.clientId;
      this.email = params.email;
      this.password = params.password;
      this.authMethod = params.authMethod;
      this.authProvider = params.authProvider;
      this.customerStatusId = params.customerStatusId;
      this.createdBy = params.createdBy;
      this.firstName = params.firstName;
      this.lastName = params.lastName;
      this.nombreComercial = params.nombreComercial;
      this.razonSocial = params.razonSocial;
    }
  }
}
