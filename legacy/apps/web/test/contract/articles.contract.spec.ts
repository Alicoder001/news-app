import { describe, expect, it, jest } from '@jest/globals';

const requestBackendMock = jest.fn();

jest.mock('@/lib/api/backend-client', () => ({
  CORS_HEADERS: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  requestBackend: requestBackendMock,
}));

describe('Articles contract parity', () => {
  it('keeps legacy /api/articles shape mapped from canonical payload', async () => {
    (requestBackendMock as unknown as { mockResolvedValue: (value: unknown) => void }).mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        success: true,
        data: {
          articles: [
            {
              id: 'a1',
              slug: 'article-1',
              title: 'Article 1',
              summary: 'Summary 1',
              imageUrl: null,
              category: null,
              readingTime: 4,
              difficulty: 'INTERMEDIATE',
              importance: 'MEDIUM',
              viewCount: 11,
              createdAt: '2026-02-13T00:00:00.000Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      },
    } as unknown);

    const { GET } = await import('@/app/api/articles/route');

    const response = await GET(new Request('http://localhost/api/articles?page=1&limit=10'));
    const body = await response.json();

    expect(body).toMatchSnapshot('legacy-response-shape');
    expect(body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
    expect(body.articles[0].slug).toBe('article-1');
  });
});
