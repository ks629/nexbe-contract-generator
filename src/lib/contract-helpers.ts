// =====================================================
// NEXBE Contract Generator — Helper Functions
// =====================================================

/**
 * Generuje numer umowy: MSAN/{numer}/{miesiąc}/{rok}
 */
export function generateContractNumber(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  // Pobierz i inkrementuj licznik z localStorage
  const storageKey = `nexbe_contract_counter_${year}_${month}`;
  let counter = 1;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      counter = parseInt(stored, 10) + 1;
    }
    localStorage.setItem(storageKey, String(counter));
  }

  const counterStr = String(counter).padStart(3, '0');
  return `MSAN/${counterStr}/${month}/${year}`;
}

/**
 * Formatowanie kwoty PLN: 34 000,00 zł
 */
export function formatPLN(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatowanie kwoty PLN bez symbolu waluty
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatowanie daty: 16 lutego 2026 r.
 */
export function formatDatePolish(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} r.`;
}

/**
 * Obliczanie ceny netto na podstawie brutto i stawki VAT
 */
export function calculateNetFromGross(grossPrice: number, vatRate: 8 | 23): {
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
} {
  const netPrice = grossPrice / (1 + vatRate / 100);
  const vatAmount = grossPrice - netPrice;
  return {
    netPrice: Math.round(netPrice * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grossPrice,
  };
}

/**
 * Obliczanie transz płatności
 */
export function calculateTranches(grossPrice: number): {
  t1_percent: 30;
  t1_amount: number;
  t2_percent: 60;
  t2_amount: number;
  t3_percent: 10;
  t3_amount: number;
} {
  const t1 = Math.round(grossPrice * 0.3 * 100) / 100;
  const t2 = Math.round(grossPrice * 0.6 * 100) / 100;
  const t3 = Math.round((grossPrice - t1 - t2) * 100) / 100;
  return {
    t1_percent: 30,
    t1_amount: t1,
    t2_percent: 60,
    t2_amount: t2,
    t3_percent: 10,
    t3_amount: t3,
  };
}

/**
 * Walidacja zmiany ceny ±5%
 */
export function validatePriceChange(offerPrice: number, newPrice: number): {
  valid: boolean;
  minPrice: number;
  maxPrice: number;
  percentChange: number;
} {
  const minPrice = Math.round(offerPrice * 0.95 * 100) / 100;
  const maxPrice = Math.round(offerPrice * 1.05 * 100) / 100;
  const percentChange = ((newPrice - offerPrice) / offerPrice) * 100;
  return {
    valid: newPrice >= minPrice && newPrice <= maxPrice,
    minPrice,
    maxPrice,
    percentChange: Math.round(percentChange * 10) / 10,
  };
}

/**
 * Nazwa OSD po polsku
 */
export function getOSDName(osd: string): string {
  const names: Record<string, string> = {
    PGE: 'PGE Dystrybucja S.A.',
    TAURON: 'TAURON Dystrybucja S.A.',
    ENEA: 'ENEA Operator sp. z o.o.',
    ENERGA: 'ENERGA-OPERATOR S.A.',
    STOEN: 'Stoen Operator sp. z o.o.',
  };
  return names[osd] || osd;
}

/**
 * Status umowy po polsku
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Szkic',
    GENERATED: 'Wygenerowana',
    SENT_FOR_SIGNATURE: 'Wysłana do podpisu',
    SIGNED: 'Podpisana',
  };
  return labels[status] || status;
}

/**
 * Kolor badge statusu
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-500',
    GENERATED: 'bg-blue-500',
    SENT_FOR_SIGNATURE: 'bg-amber-500',
    SIGNED: 'bg-green-500',
  };
  return colors[status] || 'bg-gray-500';
}

/**
 * Kwota słownie (uproszczona wersja)
 */
export function amountInWords(amount: number): string {
  // Uproszczona wersja - w produkcji użyć biblioteki n2words
  const rounded = Math.round(amount * 100) / 100;
  const [zloty, grosze] = rounded.toFixed(2).split('.');
  return `${formatAmount(rounded)} zł (${zloty} zł ${grosze}/100)`;
}
