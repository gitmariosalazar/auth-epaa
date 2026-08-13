import { Injectable, Logger } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  IVerificationRepository,
  CreateVerificationData,
} from '../../../../domain/contracts/verification.interface.repository';
import { VerificationModel } from '../../../../domain/schemas/models/verification.model';

/**
 * MySQLVerificationPersistence
 *
 * SRP  : solo persiste y consulta datos de verificación.
 * DIP  : implementa IVerificationRepository — el UseCase no depende de esta clase.
 * OCP  : para otro motor (MySQL) se crea una nueva clase sin tocar nada.
 */
@Injectable()
export class MySQLVerificationPersistence implements IVerificationRepository {
  private readonly logger = new Logger(MySQLVerificationPersistence.name);

  constructor(private readonly databaseService: DatabaseAbstract) {}

  async create(data: CreateVerificationData): Promise<void> {
    const query = `
      INSERT INTO public.verificar_cuenta_cliente
        (cliente_usuario_id, tipo_verificacion_id, codigo, fecha_expiracion, ip_solicitud)
      VALUES (
        $1,
        (SELECT tipo_verificacion_id FROM public.tipo_verificacion WHERE codigo = $2),
        $3,
        $4,
        $5
      )
    `;
    await this.databaseService.execute(query, [
      data.clienteUsuarioId,
      data.tipoCodigo,
      data.codigo,
      data.fechaExpiracion,
      data.ipSolicitud ?? null,
    ]);
    this.logger.log(
      `[Verification.create] Registrado código para user: ${data.clienteUsuarioId}`,
    );
  }

  async findActivePendingByUser(
    clienteUsuarioId: string,
    tipoCodigo: string,
  ): Promise<VerificationModel | null> {
    const query = `
      SELECT
        v.verificacion_id,
        v.cliente_usuario_id,
        v.tipo_verificacion_id,
        v.codigo,
        v.token,
        v.activo,
        v.intentos,
        v.max_intentos,
        v.fecha_expiracion,
        v.fecha_verificado,
        v.ip_solicitud,
        v.created_at,
        v.updated_at
      FROM public.verificar_cuenta_cliente v
      INNER JOIN public.tipo_verificacion t ON t.tipo_verificacion_id = v.tipo_verificacion_id
      WHERE v.cliente_usuario_id = $1
        AND t.codigo = $2
        AND v.activo = true
        AND v.fecha_expiracion > NOW()
      ORDER BY v.created_at DESC
      LIMIT 1
    `;
    const rows = await this.databaseService.query<any>(query, [
      clienteUsuarioId,
      tipoCodigo,
    ]);
    if (rows.length === 0) return null;
    return this.mapRowToModel(rows[0]);
  }

  async incrementAttempts(verificacionId: string): Promise<void> {
    const query = `
      UPDATE public.verificar_cuenta_cliente
      SET
        intentos = intentos + 1,
        activo   = CASE WHEN intentos + 1 >= max_intentos THEN false ELSE activo END
      WHERE verificacion_id = $1
    `;
    await this.databaseService.execute(query, [verificacionId]);
  }

  async markVerified(verificacionId: string): Promise<void> {
    const query = `
      UPDATE public.verificar_cuenta_cliente
      SET fecha_verificado = NOW(),
          activo           = false
      WHERE verificacion_id = $1
    `;
    await this.databaseService.execute(query, [verificacionId]);
  }

  async invalidatePreviousActive(
    clienteUsuarioId: string,
    tipoCodigo: string,
  ): Promise<void> {
    const query = `
      UPDATE public.verificar_cuenta_cliente
      SET activo = false
      WHERE cliente_usuario_id = $1
        AND tipo_verificacion_id = (
          SELECT tipo_verificacion_id FROM public.tipo_verificacion WHERE codigo = $2
        )
        AND activo = true
    `;
    await this.databaseService.execute(query, [clienteUsuarioId, tipoCodigo]);
  }

  private mapRowToModel(row: any): VerificationModel {
    const model = new VerificationModel();
    model.verificacionId = row.verificacion_id;
    model.clienteUsuarioId = row.cliente_usuario_id;
    model.tipoVerificacionId = row.tipo_verificacion_id;
    model.codigo = row.codigo ?? null;
    model.token = row.token ?? null;
    model.activo = row.activo;
    model.intentos = row.intentos;
    model.maxIntentos = row.max_intentos;
    model.fechaExpiracion = new Date(row.fecha_expiracion);
    model.fechaVerificado = row.fecha_verificado
      ? new Date(row.fecha_verificado)
      : null;
    model.ipSolicitud = row.ip_solicitud ?? null;
    model.createdAt = new Date(row.created_at);
    model.updatedAt = new Date(row.updated_at);
    return model;
  }
}
