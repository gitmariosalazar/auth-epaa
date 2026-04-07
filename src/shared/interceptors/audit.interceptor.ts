import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditContextStorage } from '../utils/audit-context.storage';
import { KafkaContext } from '@nestjs/microservices';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Verificar si es una llamada RPC (Kafka)
    if (context.getType() === 'rpc') {
      const rpcContext = context.switchToRpc();
      const kafkaContext = rpcContext.getContext<KafkaContext>();
      const headers = kafkaContext.getMessage().headers;

      const userId = headers?.['user-id']?.toString();
      const userName = headers?.['user-name']?.toString();
      const ip = headers?.['user-ip']?.toString();
      const sessionId = headers?.['user-session-id']?.toString();
      const userAgent = headers?.['user-agent']?.toString();

      if (userId || ip || sessionId) {
        return new Observable((observer) => {
          AuditContextStorage.run(
            {
              userId: userId || undefined,
              userName: userName || 'Anonymous',
              ip: ip || '0.0.0.0',
              sessionId: sessionId || undefined,
              userAgent: userAgent || 'N/A',
            },
            () => {
              next.handle().subscribe(observer);
            },
          );
        });
      }
    }

    return next.handle();
  }
}
