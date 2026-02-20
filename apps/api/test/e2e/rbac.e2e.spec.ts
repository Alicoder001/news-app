import {
  Controller,
  Get,
  INestApplication,
  UseGuards,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, it } from '@jest/globals';
import request from 'supertest';

import { AuthService } from '../../src/modules/identity-access/application/services/auth.service';
import { JwtAuthGuard } from '../../src/modules/identity-access/infrastructure/security/jwt-auth.guard';
import { Roles } from '../../src/modules/identity-access/infrastructure/security/roles.decorator';
import { RolesGuard } from '../../src/modules/identity-access/infrastructure/security/roles.guard';
import { TokenSessionService } from '../../src/modules/identity-access/infrastructure/security/token-session.service';

@Controller('rbac-test')
@UseGuards(JwtAuthGuard, RolesGuard)
class RbacTestController {
  @Get('editor')
  @Roles('EDITOR', 'SUPER_ADMIN')
  editor() {
    return { ok: true };
  }

  @Get('super')
  @Roles('SUPER_ADMIN')
  superAdmin() {
    return { ok: true };
  }
}

describe('RBAC E2E', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              security: {
                adminSecret: 'super-secret-password',
                internalToken: 'internal-token-1234567890',
                jwtAccessSecret: 'access-secret-1234567890',
                jwtRefreshSecret: 'refresh-secret-1234567890',
                jwtAccessExpiresIn: '1h',
                jwtRefreshExpiresIn: '7d',
              },
            }),
          ],
        }),
        JwtModule.register({}),
      ],
      controllers: [RbacTestController],
      providers: [
        AuthService,
        JwtAuthGuard,
        RolesGuard,
        Reflector,
        TokenSessionService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    authService = moduleRef.get(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects protected route access without bearer token', async () => {
    await request(app.getHttpServer())
      .get('/rbac-test/editor')
      .expect(401);
  });

  it('allows editor token on editor route but denies on super-admin route', async () => {
    const editorLogin = await authService.login('editor', 'super-secret-password');
    const editorAccessToken = editorLogin.accessToken;

    await request(app.getHttpServer())
      .get('/rbac-test/editor')
      .set('Authorization', `Bearer ${editorAccessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/rbac-test/super')
      .set('Authorization', `Bearer ${editorAccessToken}`)
      .expect(403);
  });

  it('allows super admin on super-admin route', async () => {
    const superAdminLogin = await authService.login('superadmin', 'super-secret-password');
    const superAdminAccessToken = superAdminLogin.accessToken;

    await request(app.getHttpServer())
      .get('/rbac-test/super')
      .set('Authorization', `Bearer ${superAdminAccessToken}`)
      .expect(200);
  });
});
