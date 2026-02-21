// ─── Line Icon Names (33 + 8 new = 41) ─────────────────────────────

export type NexbeLineIconName =
  // Produkty i Usługi (10)
  | 'magazyn-energii'
  | 'fotowoltaika'
  | 'ladowarka-ev'
  | 'auto-elektryczne'
  | 'falownik'
  | 'retrofit'
  | 'pompa-ciepla'
  | 'smart-ems'
  | 'instalacja-pv'
  | 'system-hybrydowy'
  // Finanse i Dotacje (8)
  | 'dotacja'
  | 'moj-prad'
  | 'oszczednosci'
  | 'raty'
  | 'roi'
  | 'kalkulator'
  | 'ulga-termomodernizacyjna'
  | 'bezplatna-wycena'
  // Energia i Technologia (9)
  | 'energia-sloneczna'
  | 'energia-nocna'
  | 'siec-energetyczna'
  | 'blackout-ochrona'
  | 'monitoring-247'
  | 'bateria-lfp'
  | 'zywotnosc'
  | 'pojemnosc-kwh'
  | 'co2-redukcja'
  // Zaufanie i Social Proof (6)
  | 'certyfikat'
  | 'gwiazdki-opinie'
  | 'gwarancja'
  | 'instalatorzy'
  | 'partner-keno'
  | 'forbes-30u30'
  // Nowe ikony v1.1 (8)
  | 'dom-energia'
  | 'v2h'
  | 'taryfa-dynamiczna'
  | 'dokumenty'
  | 'klient'
  | 'zespol'
  | 'szkolenie'
  | 'baza-wiedzy';

// ─── NEXBi Mini Icon Names (19) ────────────────────────────────────

export type NexbiMiniIconName =
  // Proces Zakupu (8)
  | 'nexbi-konfiguracja'
  | 'nexbi-doradca'
  | 'nexbi-wycena'
  | 'nexbi-umowa'
  | 'nexbi-dostawa'
  | 'nexbi-montaz'
  | 'nexbi-uruchomienie'
  | 'nexbi-serwis'
  // Edukacja i Wiedza (8)
  | 'nexbi-naukowiec'
  | 'nexbi-ekolog'
  | 'nexbi-superhero'
  | 'nexbi-pomysl'
  | 'nexbi-pytanie'
  | 'nexbi-ok'
  | 'nexbi-powitanie'
  | 'nexbi-prezentacja'
  // Kontakt i CTA (3)
  | 'nexbi-telefon'
  | 'nexbi-chat'
  | 'nexbi-formularz';

// ─── Combined ──────────────────────────────────────────────────────

export type NexbeIconName = NexbeLineIconName | NexbiMiniIconName;

// ─── Variants ──────────────────────────────────────────────────────

/** Color variant for line icons (CSS-controlled via currentColor) */
export type NexbeIconVariant = 'flame' | 'light' | 'dark' | 'muted' | 'inherit';

/** SVG file variant for NEXBi mini icons (different color palettes) */
export type NexbiVariant = 'default' | 'light' | 'outlined';

// ─── Component Props ───────────────────────────────────────────────

export interface NexbeIconProps {
  /** Icon name (without "icon-" prefix) */
  name: NexbeIconName;
  /** Size in pixels (default: 24) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Color variant for line icons (default: 'flame') */
  variant?: NexbeIconVariant;
  /** SVG variant for NEXBi mini icons (default: 'default') */
  nexbiVariant?: NexbiVariant;
  /** Accessible label override */
  'aria-label'?: string;
  /** Optional style object */
  style?: React.CSSProperties;
}
