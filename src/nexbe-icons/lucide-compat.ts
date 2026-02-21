import type { NexbeIconName } from './types';

/**
 * Mapping from Lucide React icon names to NEXBE brand equivalents.
 * Only domain-specific (energy/OZE/finance) icons are mapped.
 * UI primitives (Menu, X, ChevronDown, etc.) stay as Lucide.
 */
export const LUCIDE_TO_NEXBE: Record<string, NexbeIconName> = {
  // Produkty
  Battery:        'magazyn-energii',
  Sun:            'fotowoltaika',
  Car:            'auto-elektryczne',
  Plug:           'ladowarka-ev',
  PlugZap:        'ladowarka-ev',
  Cpu:            'falownik',
  Thermometer:    'pompa-ciepla',
  RefreshCw:      'retrofit',
  Package:        'system-hybrydowy',
  Warehouse:      'magazyn-energii',
  // Finanse
  Calculator:     'kalkulator',
  CreditCard:     'raty',
  Banknote:       'dotacja',
  PiggyBank:      'oszczednosci',
  TrendingUp:     'roi',
  Landmark:       'ulga-termomodernizacyjna',
  Target:         'bezplatna-wycena',
  // Energia / Tech
  Sparkles:       'smart-ems',
  Brain:          'smart-ems',
  BarChart3:      'monitoring-247',
  Globe:          'siec-energetyczna',
  // Zaufanie / Social Proof
  Shield:         'blackout-ochrona',
  ShieldCheck:    'certyfikat',
  Award:          'certyfikat',
  Trophy:         'forbes-30u30',
  Star:           'gwiazdki-opinie',
  // Nowe ikony v1.1
  Home:           'dom-energia',
  FileText:       'dokumenty',
  User:           'klient',
  Users:          'zespol',
  GraduationCap:  'szkolenie',
  BookOpen:       'baza-wiedzy',
  TrendingDown:   'taryfa-dynamiczna',
};

/**
 * Lucide icons that should STAY as Lucide (UI primitives / generic actions).
 * These are NOT replaced with NEXBE equivalents.
 */
export const LUCIDE_KEEP = new Set([
  'Menu', 'X', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp',
  'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
  'ExternalLink', 'Send', 'Download', 'FileDown', 'Copy',
  'Check', 'CheckCheck', 'CheckCircle', 'AlertCircle', 'AlertTriangle',
  'XCircle', 'Loader2', 'Info', 'Lock', 'Plus', 'Minus',
  'Search', 'ZoomIn', 'RotateCcw',
  'Phone', 'Mail', 'MessageSquare', 'MessageCircle',
  'Play', 'Pause', 'Quote',
  'Linkedin', 'Github',
  'LayoutDashboard', 'Settings', 'Settings2',
  'MapPin', 'Map', 'Calendar', 'CalendarCheck', 'Pin',
  'ClipboardList', 'FileCheck', 'FileSignature',
  'Crown', 'Percent', 'Lightbulb',
  'Store', 'Building2', 'Laptop',
  'HelpCircle', 'Zap',
]);
