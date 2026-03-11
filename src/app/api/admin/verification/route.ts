import { createVerificationRecord, listVerificationRecords } from '@/lib/verification/verification.service';
import { ok, withRouteHandler } from '@/lib/api/response';
import { ValidationError } from '@/lib/errors/domain';

export async function GET() {
  return withRouteHandler(async () => listVerificationRecords());
}

export async function POST(request: Request) {
  return withRouteHandler(async () => {
    const body = (await request.json()) as {
      rawArticleId?: string;
      status?: 'VERIFIED' | 'PARTIAL' | 'INSUFFICIENT';
      confidence?: number;
      notes?: string;
      sourceCount?: number;
    };

    if (!body.rawArticleId || !body.status || typeof body.confidence !== 'number' || typeof body.sourceCount !== 'number') {
      throw new ValidationError('rawArticleId, status, confidence and sourceCount are required');
    }

    const record = await createVerificationRecord({
      rawArticleId: body.rawArticleId,
      status: body.status,
      confidence: body.confidence,
      notes: body.notes,
      sourceCount: body.sourceCount,
    });

    return ok(record, 201);
  });
}
