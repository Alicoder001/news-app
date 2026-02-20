import { describe, expect, it, jest } from '@jest/globals';

const getAdminApiAuthHeadersMock = jest.fn();
const requestBackendMock = jest.fn();

jest.mock('@/lib/admin/auth', () => ({
  getAdminApiAuthHeaders: getAdminApiAuthHeadersMock,
}));

jest.mock('@/lib/api/backend-client', () => ({
  requestBackend: requestBackendMock,
}));

describe('Admin API route authorization', () => {
  it('returns 401 for manual sync trigger without admin session', async () => {
    (getAdminApiAuthHeadersMock as unknown as { mockResolvedValue: (value: unknown) => void }).mockResolvedValue(null);

    const { POST } = await import('@/app/api/news/sync/route');
    const response = await POST();
    const body = (await response.json()) as { error?: string };

    expect(response.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
    expect(requestBackendMock).not.toHaveBeenCalled();
  });
});
