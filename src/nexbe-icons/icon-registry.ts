import type { NexbeIconName, NexbeLineIconName, NexbiMiniIconName } from './types';

export interface IconMeta {
  name: NexbeIconName;
  label: string;
  category: string;
  type: 'line' | 'nexbi';
}

// ─── Line Icons Registry ───────────────────────────────────────────

export const LINE_ICONS: Record<NexbeLineIconName, { label: string; category: string }> = {
  // Produkty
  'magazyn-energii':    { label: 'Magazyn energii',    category: 'Produkty' },
  'fotowoltaika':       { label: 'Panel słoneczny',    category: 'Produkty' },
  'ladowarka-ev':       { label: 'Ładowarka EV',       category: 'Produkty' },
  'auto-elektryczne':   { label: 'Auto elektryczne',   category: 'Produkty' },
  'falownik':           { label: 'Falownik AC/DC',     category: 'Produkty' },
  'retrofit':           { label: 'Retrofit / upgrade',  category: 'Produkty' },
  'pompa-ciepla':       { label: 'Pompa ciepła',       category: 'Produkty' },
  'smart-ems':          { label: 'Smart EMS',          category: 'Produkty' },
  'instalacja-pv':      { label: 'Instalacja PV',      category: 'Produkty' },
  'system-hybrydowy':   { label: 'System hybrydowy',   category: 'Produkty' },
  // Finanse
  'dotacja':            { label: 'Dotacja',            category: 'Finanse' },
  'moj-prad':           { label: 'Mój Prąd',          category: 'Finanse' },
  'oszczednosci':       { label: 'Oszczędności',       category: 'Finanse' },
  'raty':               { label: 'Raty',               category: 'Finanse' },
  'roi':                { label: 'ROI',                category: 'Finanse' },
  'kalkulator':         { label: 'Kalkulator',         category: 'Finanse' },
  'ulga-termomodernizacyjna': { label: 'Ulga termomod.', category: 'Finanse' },
  'bezplatna-wycena':   { label: 'Bezpłatna wycena',   category: 'Finanse' },
  // Energia/Tech
  'energia-sloneczna':  { label: 'Energia słoneczna',  category: 'Energia' },
  'energia-nocna':      { label: 'Energia nocna',      category: 'Energia' },
  'siec-energetyczna':  { label: 'Sieć energetyczna',  category: 'Energia' },
  'blackout-ochrona':   { label: 'Ochrona blackout',   category: 'Energia' },
  'monitoring-247':     { label: 'Monitoring 24/7',     category: 'Energia' },
  'bateria-lfp':        { label: 'Bateria LFP',        category: 'Energia' },
  'zywotnosc':          { label: 'Żywotność',          category: 'Energia' },
  'pojemnosc-kwh':      { label: 'Pojemność kWh',      category: 'Energia' },
  'co2-redukcja':       { label: 'Redukcja CO₂',       category: 'Energia' },
  // Zaufanie
  'certyfikat':         { label: 'Certyfikat',         category: 'Zaufanie' },
  'gwiazdki-opinie':    { label: 'Opinie 5★',          category: 'Zaufanie' },
  'gwarancja':          { label: 'Gwarancja',          category: 'Zaufanie' },
  'instalatorzy':       { label: 'Instalatorzy',       category: 'Zaufanie' },
  'partner-keno':       { label: 'Partnerstwo',        category: 'Zaufanie' },
  'forbes-30u30':       { label: 'Forbes 30u30',       category: 'Zaufanie' },
  // Nowe v1.1
  'dom-energia':        { label: 'Dom z energią',      category: 'Energia' },
  'v2h':                { label: 'Vehicle-to-Home',    category: 'Energia' },
  'taryfa-dynamiczna':  { label: 'Taryfa dynamiczna',  category: 'Finanse' },
  'dokumenty':          { label: 'Dokumenty',          category: 'Ogólne' },
  'klient':             { label: 'Klient',             category: 'Ogólne' },
  'zespol':             { label: 'Zespół',             category: 'Ogólne' },
  'szkolenie':          { label: 'Szkolenie',          category: 'Ogólne' },
  'baza-wiedzy':        { label: 'Baza wiedzy',        category: 'Ogólne' },
};

// ─── NEXBi Mini Icons Registry ─────────────────────────────────────

export const NEXBI_ICONS: Record<NexbiMiniIconName, { label: string; category: string }> = {
  'nexbi-konfiguracja':  { label: 'Konfiguracja',  category: 'Proces' },
  'nexbi-doradca':       { label: 'Doradca',       category: 'Proces' },
  'nexbi-wycena':        { label: 'Wycena',        category: 'Proces' },
  'nexbi-umowa':         { label: 'Umowa',         category: 'Proces' },
  'nexbi-dostawa':       { label: 'Dostawa',       category: 'Proces' },
  'nexbi-montaz':        { label: 'Montaż',        category: 'Proces' },
  'nexbi-uruchomienie':  { label: 'Uruchomienie',  category: 'Proces' },
  'nexbi-serwis':        { label: 'Serwis',        category: 'Proces' },
  'nexbi-naukowiec':     { label: 'Naukowiec',     category: 'Edukacja' },
  'nexbi-ekolog':        { label: 'Ekolog',        category: 'Edukacja' },
  'nexbi-superhero':     { label: 'Superhero',     category: 'Edukacja' },
  'nexbi-pomysl':        { label: 'Pomysł',        category: 'Edukacja' },
  'nexbi-pytanie':       { label: 'Pytanie',       category: 'Edukacja' },
  'nexbi-ok':            { label: 'OK / Kciuk',    category: 'Edukacja' },
  'nexbi-powitanie':     { label: 'Powitanie',     category: 'Edukacja' },
  'nexbi-prezentacja':   { label: 'Prezentacja',   category: 'Edukacja' },
  'nexbi-telefon':       { label: 'Telefon',       category: 'Kontakt' },
  'nexbi-chat':          { label: 'Chat',          category: 'Kontakt' },
  'nexbi-formularz':     { label: 'Formularz',     category: 'Kontakt' },
};

// ─── All icons combined ────────────────────────────────────────────

export const ALL_ICONS: IconMeta[] = [
  ...Object.entries(LINE_ICONS).map(([name, meta]) => ({
    name: name as NexbeIconName,
    type: 'line' as const,
    ...meta,
  })),
  ...Object.entries(NEXBI_ICONS).map(([name, meta]) => ({
    name: name as NexbeIconName,
    type: 'nexbi' as const,
    ...meta,
  })),
];

// ─── Helper to check if icon is NEXBi type ─────────────────────────

export function isNexbiIcon(name: string): name is NexbiMiniIconName {
  return name.startsWith('nexbi-');
}
