import { createSource, listSources } from '@/lib/rss/source.service';
import { ok, withRouteHandler } from '@/lib/api/response';
import { ValidationError } from '@/lib/errors/domain';

export async function GET() {
  return withRouteHandler(async () => listSources());
}

export async function POST(request: Request) {
  return withRouteHandler(async () => {
    const body = (await request.json()) as { name?: string; url?: string };

    if (!body.name || !body.url) {
      throw new ValidationError('name and url are required');
    }

    const source = await createSource({
      name: body.name,
      url: body.url,
    });

    return ok(source, 201);
  });
}
