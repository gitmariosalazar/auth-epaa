import { Inject, Injectable, Logger } from '@nestjs/common';
import { IVerificationRepository } from '../../domain/contracts/verification.interface.repository';
import { InterfaceCustomerRepository } from '../../domain/contracts/customer.interface.repository';
import {
  VerificationNotFoundException,
  VerificationCodeInvalidException,
  VerificationMaxAttemptsException,
} from '../../domain/exceptions/verification.exceptions';

/**
 * VerifyAccountByCodeUseCase
 *
 * SRP : solo valida el código y actualiza el estado de la cuenta.
 * DIP : depende de interfaces, no de implementaciones concretas.
 * OCP : soporta EMAIL_CODE y PHONE_CODE sin cambios — el tipo se pasa como parámetro.
 */
@Injectable()
export class VerifyAccountByCodeUseCase {
  private readonly logger = new Logger(VerifyAccountByCodeUseCase.name);

  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: IVerificationRepository,

    @Inject('CustomerRepository')
    private readonly customerRepository: InterfaceCustomerRepository,
  ) {}

  /**
   * @param clienteUsuarioId UUID del cliente_usuario
   * @param codigoIngresado  Código de 6 dígitos que ingresó el usuario
   * @param tipoCodigo       'EMAIL_CODE' | 'PHONE_CODE'
   * @returns true si la verificación fue exitosa
   */
  async execute(
    clienteUsuarioId: string,
    codigoIngresado: string,
    tipoCodigo: string,
  ): Promise<{ verified: boolean; message: string }> {
    this.logger.log(
      `[VerifyAccountByCode] user: ${clienteUsuarioId}, tipo: ${tipoCodigo}`,
    );

    // 1. Buscar verificación activa y no expirada
    //    (la expiración se filtra en la query de BD con fecha_expiracion > now())
    const verification = await this.verificationRepository.findActivePendingByUser(
      clienteUsuarioId,
      tipoCodigo,
    );

    if (!verification) {
      // Puede ser: no existe, ya expiró, o ya fue usada
      throw new VerificationNotFoundException(clienteUsuarioId);
    }

    // 2. Verificar que no se excedieron los intentos
    if (verification.intentos >= verification.maxIntentos) {
      throw new VerificationMaxAttemptsException();
    }

    // 3. Comparar el código (trim + insensible a mayúsculas para robustez)
    const codigoValido =
      verification.codigo?.trim() === codigoIngresado.trim();

    if (!codigoValido) {
      // Incrementar intentos; si llega al máximo, el repo lo desactiva automáticamente
      await this.verificationRepository.incrementAttempts(verification.verificacionId);
      const intentosRestantes = verification.maxIntentos - (verification.intentos + 1);

      if (intentosRestantes <= 0) {
        throw new VerificationMaxAttemptsException();
      }

      throw new VerificationCodeInvalidException(intentosRestantes);
    }

    // 4. Código correcto → marcar como verificado
    await this.verificationRepository.markVerified(verification.verificacionId);

    // 5. Activar la cuenta del cliente
    //    email_verified = true, customerStatusId = 1 (activo)
    const updatePayload =
      tipoCodigo === 'EMAIL_CODE'
        ? { emailVerified: true, customerStatusId: 1 }
        : { telefonoVerified: true };

    await this.customerRepository.update(clienteUsuarioId, updatePayload);

    this.logger.log(
      `[VerifyAccountByCode] ✅ Cuenta verificada exitosamente: ${clienteUsuarioId}`,
    );

    return {
      verified: true,
      message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.',
    };
  }
}
