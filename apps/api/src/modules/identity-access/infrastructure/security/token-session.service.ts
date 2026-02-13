import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenSessionService {
  private readonly tokenVersions = new Map<string, number>();
  private readonly activeRefreshTokens = new Map<string, Set<string>>();

  getCurrentVersion(subject: string): number {
    if (!this.tokenVersions.has(subject)) {
      this.tokenVersions.set(subject, 1);
    }
    return this.tokenVersions.get(subject) ?? 1;
  }

  isVersionValid(subject: string, version: number): boolean {
    return this.getCurrentVersion(subject) === version;
  }

  rotateVersion(subject: string): number {
    const nextVersion = this.getCurrentVersion(subject) + 1;
    this.tokenVersions.set(subject, nextVersion);
    this.activeRefreshTokens.delete(subject);
    return nextVersion;
  }

  registerRefreshToken(subject: string, jti: string): void {
    const tokens = this.activeRefreshTokens.get(subject) ?? new Set<string>();
    tokens.add(jti);
    this.activeRefreshTokens.set(subject, tokens);
  }

  consumeRefreshToken(subject: string, jti: string): boolean {
    const tokens = this.activeRefreshTokens.get(subject);
    if (!tokens || !tokens.has(jti)) {
      return false;
    }
    tokens.delete(jti);
    if (tokens.size === 0) {
      this.activeRefreshTokens.delete(subject);
    }
    return true;
  }
}
