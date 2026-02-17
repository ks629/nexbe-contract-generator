import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ContractPDF } from '@/lib/pdf/ContractPDF';
import { ContractData } from '@/types/contract';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const data: ContractData = await request.json();

    // Generate PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      React.createElement(ContractPDF, { data }) as any
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
