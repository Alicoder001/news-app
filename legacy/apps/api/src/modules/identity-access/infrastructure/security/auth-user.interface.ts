import type { AdminRole } from '../../domain/value-objects/role.vo';

export interface AuthUser {
  sub: string;
  role: AdminRole;
  type: 'access' | 'refresh';
  ver: number;
  jti?: string;
}
