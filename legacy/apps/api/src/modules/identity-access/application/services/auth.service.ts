import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { randomUUID } from 'node:crypto';

import type { AdminRole } from '../../domain/value-objects/role.vo';
import type { AuthUser } from '../../infrastructure/security/auth-user.interface';
import { TokenSessionService } from '../../infrastructure/security/token-session.service';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenSessionService: TokenSessionService,
  ) {}

  async login(username: string, password: string) {
    const adminSecret = this.configService.get<string>('security.adminSecret');
    if (!adminSecret) {
      throw new ServiceUnavailableException(
        'ADMIN_SECRET is not configured for identity-access context',
      );
    }

    if (password !== adminSecret) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role: AdminRole = username.toLowerCase() === 'superadmin' ? 'SUPER_ADMIN' : 'EDITOR';
    const version = this.tokenSessionService.getCurrentVersion(username);
    const tokens = await this.issueTokens({ sub: username, role, version });

    return {
      success: true,
      message: 'Authenticated',
      username,
      role,
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    const refreshSecret = this.configService.get<string>('security.jwtRefreshSecret');
    if (!refreshSecret) {
      throw new ServiceUnavailableException('JWT refresh secret is not configured');
    }

    let payload: AuthUser;
    try {
      payload = await this.jwtService.verifyAsync<AuthUser>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    if (!payload.jti) {
      throw new UnauthorizedException('Refresh token identifier is missing');
    }

    if (!this.tokenSessionService.isVersionValid(payload.sub, payload.ver)) {
      throw new UnauthorizedException('Refresh token version is invalid');
    }

    const consumed = this.tokenSessionService.consumeRefreshToken(payload.sub, payload.jti);
    if (!consumed) {
      throw new UnauthorizedException('Refresh token is revoked or already used');
    }

    const tokens = await this.issueTokens({
      sub: payload.sub,
      role: payload.role,
      version: payload.ver,
    });
    return {
      success: true,
      message: 'Tokens refreshed',
      ...tokens,
    };
  }

  logout(subject: string) {
    this.tokenSessionService.rotateVersion(subject);

    return {
      success: true,
      message: 'Logged out and tokens revoked',
    };
  }

  private async issueTokens(payload: {
    sub: string;
    role: AdminRole;
    version: number;
  }): Promise<AuthTokens> {
    const accessSecret = this.configService.get<string>('security.jwtAccessSecret');
    const refreshSecret = this.configService.get<string>('security.jwtRefreshSecret');
    const accessExpiresIn = this.configService.get<string>(
      'security.jwtAccessExpiresIn',
      '15m',
    ) as StringValue;
    const refreshExpiresIn = this.configService.get<string>(
      'security.jwtRefreshExpiresIn',
      '7d',
    ) as StringValue;

    if (!accessSecret || !refreshSecret) {
      throw new ServiceUnavailableException('JWT secrets are not configured');
    }

    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = await this.jwtService.signAsync(
      {
        sub: payload.sub,
        role: payload.role,
        type: 'access',
        ver: payload.version,
        jti: accessJti,
      } satisfies AuthUser,
      {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: payload.sub,
        role: payload.role,
        type: 'refresh',
        ver: payload.version,
        jti: refreshJti,
      } satisfies AuthUser,
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      },
    );

    this.tokenSessionService.registerRefreshToken(payload.sub, refreshJti);

    return { accessToken, refreshToken };
  }
}
