import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { CombinedPDF } from '@/lib/pdf/CombinedPDF';
import { ContractData } from '@/types/contract';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const data: ContractData = await request.json();

    // Generate combined PDF (contract + attachments) in one document
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      React.createElement(CombinedPDF, { data }) as any
    );

    // Return PDF as response
    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Umowa_${data.contractNumber?.replace(/\//g, '_') || 'NEXBE'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Błąd generowania PDF', details: String(error) },
      { status: 500 }
    );
  }
}
