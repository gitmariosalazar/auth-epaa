/**
 * VerificationModel — Modelo de dominio para una solicitud de verificación de cuenta.
 * Espeja la tabla public.verificar_cuenta_cliente.
 */
export class VerificationModel {
  verificacionId: string;
  clienteUsuarioId: string;
  tipoVerificacionId: number;
  codigo: string | null;
  token: string | null;
  activo: boolean;
  intentos: number;
  maxIntentos: number;
  fechaExpiracion: Date;
  fechaVerificado: Date | null;
  ipSolicitud: string | null;
  createdAt: Date;
  updatedAt: Date;
}
