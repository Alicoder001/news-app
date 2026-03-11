import type { ReviewerOutput, WriterOutput } from './types';
import type { VerificationRecord } from '@prisma/client';
import { z } from 'zod';
import { runAgentWithValidation } from './runtime';

export async function runReviewerAgent(
  writerOutput: NonNullable<WriterOutput['article']>,
  verification: VerificationRecord,
): Promise<ReviewerOutput> {
  const issues: string[] = [];

  if (!writerOutput.fullArticle.trim()) {
    issues.push('Full article is empty');
  }

  if (!writerOutput.shortPost.trim()) {
    issues.push('Short post is empty');
  }

  if (verification.sourceCount < 2) {
    issues.push('Less than 2 confirming sources');
  }

  const schema = z.object({
    decision: z.enum(['APPROVE', 'REJECT', 'HOLD']),
    reason: z.string().min(1),
    issues: z.array(z.string()),
    publishReady: z.boolean(),
  });

  return runAgentWithValidation({
    agentName: 'reviewer',
    payload: { writerOutput, verification },
    schema,
    fallback: () => {
      if (issues.length > 0) {
        return {
          decision: verification.sourceCount < 2 ? 'HOLD' : 'REJECT',
          reason: 'Draft failed review checks',
          issues,
          publishReady: false,
        };
      }

      return {
        decision: 'APPROVE',
        reason: 'Draft passed review checks',
        issues: [],
        publishReady: true,
      };
    },
  });
}
