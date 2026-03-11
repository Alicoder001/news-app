export type TrustedSource = {
  name: string;
  url: string;
  tier: 1 | 2 | 3;
};

export type VerificationResultInput = {
  rawArticleId: string;
  status: 'VERIFIED' | 'PARTIAL' | 'INSUFFICIENT';
  confidence: number;
  notes?: string;
  sourceCount: number;
};
