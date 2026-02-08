import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApiAuth } from '@/lib/admin/auth';
import { createSourceSchema, parseJsonBody } from '@/lib/admin/validation';

// POST - Create new source
export async function POST(request: NextRequest) {
  const authError = await requireAdminApiAuth(request, { requireTrustedOrigin: true });
  if (authError) return authError;

  try {
    const parsed = await parseJsonBody(request, createSourceSchema);
    if (parsed.error) return parsed.error;
    const { name, type, url, isActive } = parsed.data;

    const source = await prisma.newsSource.create({
      data: {
        name,
        type,
        url,
        isActive,
      },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
