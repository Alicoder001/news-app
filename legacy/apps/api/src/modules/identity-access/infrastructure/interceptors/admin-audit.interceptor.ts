import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import type { AuthUser } from '../security/auth-user.interface';

@Injectable()
export class AdminAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AdminAuditInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      user?: AuthUser;
      ip?: string;
    }>();

    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startedAt;
        this.logger.log(
          JSON.stringify({
            action: 'admin_api_access',
            method: request.method,
            path: request.url,
            user: request.user?.sub ?? 'unknown',
            role: request.user?.role ?? 'unknown',
            ip: request.ip ?? 'unknown',
            durationMs,
            ts: new Date().toISOString(),
          }),
        );
      }),
    );
  }
}
