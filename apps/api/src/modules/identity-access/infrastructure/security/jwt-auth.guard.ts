import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import type { AuthUser } from './auth-user.interface';
import { TokenSessionService } from './token-session.service';

type RequestWithUser = Request & { user?: AuthUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenSessionService: TokenSessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const internalToken = request.headers['x-internal-token'];
    if (typeof internalToken === 'string' && this.isValidInternalToken(internalToken)) {
      request.user = {
        sub: 'legacy-web-adapter',
        role: 'SUPER_ADMIN',
        type: 'access',
        ver: 1,
      };
      return true;
    }

    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const accessSecret = this.configService.get<string>('security.jwtAccessSecret');
    if (!accessSecret) {
      throw new UnauthorizedException('JWT access secret is not configured');
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthUser>(token, {
        secret: accessSecret,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }
      if (!this.tokenSessionService.isVersionValid(payload.sub, payload.ver)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractBearerToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    return token;
  }

  private isValidInternalToken(token: string): boolean {
    const expected = this.configService.get<string>('security.internalToken');
    return !!expected && token === expected;
  }
}
