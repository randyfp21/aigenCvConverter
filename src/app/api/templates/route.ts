import { NextResponse } from 'next/server';
import { COMPANY_TEMPLATES } from '@/lib/templates/companies';

export async function GET() {
  return NextResponse.json({
    success: true,
    templates: COMPANY_TEMPLATES,
  });
}
