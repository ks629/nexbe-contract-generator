import { NextRequest, NextResponse } from 'next/server';

/**
 * Autenti API Integration — Placeholder
 *
 * Docelowy flow:
 * 1. Upload PDF umowy do Autenti API
 * 2. Dodanie sygnatariuszy:
 *    - Nexbe sp. z o.o. (Wykonawca)
 *    - Zamawiający (klient)
 * 3. Wysłanie zaproszenia do podpisu elektronicznego
 * 4. Webhook zwrotny — aktualizacja statusu umowy
 *
 * Dokumentacja Autenti API: https://autenti.com/api-documentation/
 *
 * Wymagane zmienne środowiskowe:
 * - AUTENTI_API_KEY: klucz API Autenti
 * - AUTENTI_API_URL: URL endpointu Autenti (sandbox lub produkcja)
 * - AUTENTI_WEBHOOK_SECRET: secret do weryfikacji webhooków
 *
 * Przykładowy request do Autenti:
 * POST /api/v2/documents
 * {
 *   "title": "Umowa MSAN/001/02/2026",
 *   "description": "Umowa na rozbudowę instalacji PV o magazyn energii",
 *   "signatories": [
 *     {
 *       "email": "handlowiec@nexbe.pl",
 *       "name": "Jan Nowak",
 *       "role": "SIGNER",
 *       "order": 1
 *     },
 *     {
 *       "email": "klient@example.com",
 *       "name": "Anna Kowalska",
 *       "role": "SIGNER",
 *       "order": 2
 *     }
 *   ],
 *   "files": [{ "name": "umowa.pdf", "content": "<base64>" }],
 *   "webhook_url": "https://your-domain.vercel.app/api/autenti-webhook"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Implement Autenti API integration
    // const AUTENTI_API_KEY = process.env.AUTENTI_API_KEY;
    // const AUTENTI_API_URL = process.env.AUTENTI_API_URL || 'https://api.autenti.com/api/v2';

    return NextResponse.json({
      success: false,
      message: 'Integracja z Autenti API w przygotowaniu. Pobierz PDF i wyślij ręcznie przez panel Autenti.',
      contractNumber: body.contractNumber,
      // Przyszła odpowiedź:
      // documentId: 'autenti-doc-id',
      // signUrl: 'https://app.autenti.com/sign/...',
      // status: 'PENDING_SIGNATURES',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd integracji Autenti', details: String(error) },
      { status: 500 }
    );
  }
}
