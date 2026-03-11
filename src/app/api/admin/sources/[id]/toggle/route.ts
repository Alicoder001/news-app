import { toggleSource } from '@/lib/rss/source.service';
import { withRouteHandler } from '@/lib/api/response';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRouteHandler(async () => {
    const { id } = await params;
    const source = await toggleSource(id);
    return source;
  });
}
