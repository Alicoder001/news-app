export const ADMIN_ROLES = ['SUPER_ADMIN', 'EDITOR', 'ANALYST'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
