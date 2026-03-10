import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './application/services/auth.service';
import { AdminAuditInterceptor } from './infrastructure/interceptors/admin-audit.interceptor';
import { JwtAuthGuard } from './infrastructure/security/jwt-auth.guard';
import { RolesGuard } from './infrastructure/security/roles.guard';
import { TokenSessionService } from './infrastructure/security/token-session.service';
import { AdminAuthController } from './presentation/controllers/admin-auth.controller';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, TokenSessionService],
  controllers: [AdminAuthController],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
    AdminAuditInterceptor,
    TokenSessionService,
  ],
})
export class IdentityAccessModule {}
