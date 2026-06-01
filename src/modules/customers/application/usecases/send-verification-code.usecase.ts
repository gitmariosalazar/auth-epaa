import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import * as crypto from 'crypto';
import { IVerificationRepository } from '../../domain/contracts/verification.interface.repository';
import { InterfaceCustomerRepository } from '../../domain/contracts/customer.interface.repository';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';
import { environments } from '../../../../settings/environments/environments';

const EXPIRATION_MINUTES = 15;
const CODE_MIN = 100_000;
const CODE_MAX = 999_999;

/**
 * SendVerificationCodeUseCase
 *
 * SRP : solo genera, persiste y despacha el código de verificación.
 * DIP : depende de IVerificationRepository e InterfaceCustomerRepository (interfaces).
 * OCP : para soporte de PHONE_CODE no se cambia este usecase — solo se pasa el tipo.
 */
@Injectable()
export class SendVerificationCodeUseCase {
  private readonly logger = new Logger(SendVerificationCodeUseCase.name);

  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: IVerificationRepository,

    @Inject('CustomerRepository')
    private readonly customerRepository: InterfaceCustomerRepository,

    @Inject(environments.AUTHENTICATION_KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * @param clienteUsuarioId UUID del cliente_usuario
   * @param tipoCodigo       'EMAIL_CODE' | 'PHONE_CODE'
   * @param ipSolicitud      IP de la petición (para auditoría)
   */
  async execute(
    clienteUsuarioId: string,
    tipoCodigo: 'EMAIL_CODE' | 'PHONE_CODE',
    ipSolicitud?: string,
  ): Promise<void> {
    this.logger.log(
      `[SendVerificationCode] user: ${clienteUsuarioId}, tipo: ${tipoCodigo}`,
    );

    // 1. Verificar que el cliente existe y obtener su email
    const customer = await this.customerRepository.findById(clienteUsuarioId);
    if (!customer) {
      throw new CustomerNotFoundException(clienteUsuarioId);
    }

    // 2. Invalidar códigos activos anteriores (evitar duplicados)
    await this.verificationRepository.invalidatePreviousActive(
      clienteUsuarioId,
      tipoCodigo,
    );

    // 3. Generar código de 6 dígitos criptográficamente seguro
    const codigoNumerico = crypto.randomInt(CODE_MIN, CODE_MAX).toString();

    // 4. Calcular fecha de expiración
    const fechaExpiracion = new Date(
      Date.now() + EXPIRATION_MINUTES * 60 * 1_000,
    );

    // 5. Persistir en BD
    await this.verificationRepository.create({
      clienteUsuarioId,
      tipoCodigo,
      codigo: codigoNumerico,
      fechaExpiracion,
      ipSolicitud,
    });

    this.logger.log(
      `[SendVerificationCode] Código generado y persistido para user: ${clienteUsuarioId}`,
    );

    // 6. Publicar notificación (fire-and-forget) al microservicio de notificaciones
    //    templateId + templateVars → MS-Notificaciones renderiza el template HTML profesional
    const notificationPayload = {
      userId: clienteUsuarioId,
      title: '🔐 Código de verificación — EPAA',
      body: `Tu código de verificación es: ${codigoNumerico}. Expira en ${EXPIRATION_MINUTES} minutos. No lo compartas con nadie.`,
      channel: tipoCodigo === 'EMAIL_CODE' ? 'EMAIL' : 'WHATSAPP',
      priority: 'HIGH',
      metadata: {
        // ── Datos de envío ───────────────────────────────────────────
        to:       customer.email,
        codigo:   codigoNumerico,
        expiracion: fechaExpiracion.toISOString(),
        // ── Template HTML profesional ────────────────────────────────
        // El EmailChannelSender del MS-Notificaciones lee templateId y
        // templateVars para renderizar verification-code.html en vez
        // de enviar el body en texto plano.
        templateId: 'verification-code',
        templateVars: {
          nombre:             customer.email,
          codigo:             codigoNumerico,
          expiracionMinutos:  EXPIRATION_MINUTES,
          portalUrl:          process.env.PORTAL_URL ?? 'https://portal.epaa.gob.ec',
        },
      },
    };

    this.kafkaClient.emit('notifications_topic', {
      pattern: 'notifications.send',
      data: notificationPayload,
    });


    this.logger.log(
      `[SendVerificationCode] Notificación emitida a notifications.send para: ${customer.email}`,
    );
  }
}
