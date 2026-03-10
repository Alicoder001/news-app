import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';

import { AuthService } from '../../src/modules/identity-access/application/services/auth.service';
import { JwtAuthGuard } from '../../src/modules/identity-access/infrastructure/security/jwt-auth.guard';
import { TokenSessionService } from '../../src/modules/identity-access/infrastructure/security/token-session.service';
import { AdminAuthController } from '../../src/modules/identity-access/presentation/controllers/admin-auth.controller';

describe('Auth E2E (rotation + revoke)', () => {
  let app: INestApplication;

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
      controllers: [AdminAuthController],
      providers: [AuthService, JwtAuthGuard, TokenSessionService, JwtService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rotates refresh token and rejects replayed refresh token', async () => {
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        username: 'editor',
        password: 'super-secret-password',
      })
      .expect(200);

    const firstRefreshToken = login.body.refreshToken as string;
    expect(firstRefreshToken).toBeTruthy();

    const refreshed = await request(app.getHttpServer())
      .post('/admin/auth/refresh')
      .send({ refreshToken: firstRefreshToken })
      .expect(200);

    const secondRefreshToken = refreshed.body.refreshToken as string;
    expect(secondRefreshToken).toBeTruthy();
    expect(secondRefreshToken).not.toEqual(firstRefreshToken);

    await request(app.getHttpServer())
      .post('/admin/auth/refresh')
      .send({ refreshToken: firstRefreshToken })
      .expect(401);
  });

  it('revokes access token on logout using token version rotation', async () => {
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        username: 'superadmin',
        password: 'super-secret-password',
      })
      .expect(200);

    const accessToken = login.body.accessToken as string;
    expect(accessToken).toBeTruthy();

    await request(app.getHttpServer())
      .post('/admin/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/admin/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });
});
