import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
  },
}));

describe('Mobile API client smoke', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = jest.fn();
  });

  it('maps canonical list response to mobile list shape', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          articles: [{ id: '1', slug: 's1', title: 't1' }],
          pagination: { total: 1 },
        },
      }),
    });

    const { api } = await import('../../src/api/client');
    const result = await api.articles.list(1, 10);
    expect(result.total).toBe(1);
    expect(result.articles[0].slug).toBe('s1');
  });

  it('maps canonical category list response', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          categories: [{ id: 'c1', slug: 'tech', name: 'Tech' }],
        },
      }),
    });

    const { api } = await import('../../src/api/client');
    const categories = await api.categories.list();
    expect(categories[0].slug).toBe('tech');
  });
});
