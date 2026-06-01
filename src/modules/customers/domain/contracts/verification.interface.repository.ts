import { VerificationModel } from '../schemas/models/verification.model';

/** Datos mínimos para crear un registro de verificación */
export interface CreateVerificationData {
  clienteUsuarioId: string;
  tipoCodigo: string;        // 'EMAIL_CODE' | 'PHONE_CODE'
  codigo: string;            // Código de 6 dígitos
  fechaExpiracion: Date;     // now() + 15 min
  ipSolicitud?: string;
}

/**
 * IVerificationRepository
 * Contrato de dominio — DIP: los UseCase dependen de esta interfaz, no de la implementación.
 * OCP: para soportar MySQL u otro motor, se crea una nueva implementación sin cambiar el UseCase.
 */
export interface IVerificationRepository {
  /**
   * Crea un nuevo registro de verificación en la BD.
   */
  create(data: CreateVerificationData): Promise<void>;

  /**
   * Busca el registro activo y no expirado más reciente para un usuario y tipo dado.
   * Retorna null si no existe o si todos expiraron.
   */
  findActivePendingByUser(
    clienteUsuarioId: string,
    tipoCodigo: string,
  ): Promise<VerificationModel | null>;

  /**
   * Incrementa el contador de intentos fallidos.
   * Si intentos >= max_intentos, desactiva el registro automáticamente.
   */
  incrementAttempts(verificacionId: string): Promise<void>;

  /**
   * Marca el registro como verificado: fecha_verificado = now(), activo = false.
   */
  markVerified(verificacionId: string): Promise<void>;

  /**
   * Invalida todos los registros activos anteriores del usuario para ese tipo.
   * Se llama antes de crear uno nuevo (evita códigos duplicados activos).
   */
  invalidatePreviousActive(clienteUsuarioId: string, tipoCodigo: string): Promise<void>;
}
