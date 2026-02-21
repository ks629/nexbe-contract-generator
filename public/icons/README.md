# NEXBE Icon System v1.1

60 unikalnych ikon SVG + 38 wariantow = 98 symboli w sprite.

## Struktura

```
icons/
├── line/           41 ikon line-style (currentColor, stroke 2px)
├── nexbi/          57 ikon NEXBi mini (19 default + 19 light + 19 outlined)
├── preview/
│   └── icon-preview.html
├── sprite.svg      98 symboli <symbol>
└── README.md
```

## Podglad

Otworz `preview/icon-preview.html` w przegladarce.

## Uzycie

### Komponent React (zalecany)

```tsx
import { NexbeIcon } from '@nexbe/icons';

// Line icon — kolor z wariantu
<NexbeIcon name="magazyn-energii" size={24} variant="flame" />
<NexbeIcon name="magazyn-energii" size={24} variant="light" />
<NexbeIcon name="magazyn-energii" size={24} variant="dark" />

// NEXBi mini — wariant SVG
<NexbeIcon name="nexbi-ok" size={48} nexbiVariant="default" />
<NexbeIcon name="nexbi-ok" size={48} nexbiVariant="light" />
<NexbeIcon name="nexbi-ok" size={48} nexbiVariant="outlined" />

// Dziedziczenie koloru z rodzica
<div className="text-emerald-400">
  <NexbeIcon name="magazyn-energii" size={20} variant="inherit" />
</div>
```

### Jako sprite (`<use>`)
```html
<svg width="24" height="24" viewBox="0 0 64 64" class="text-nexbe-flame">
  <use href="/icons/sprite.svg#icon-magazyn-energii"/>
</svg>
```

### Jako `<img>`
```html
<img src="/icons/line/icon-magazyn-energii.svg" alt="Magazyn energii" class="w-6 h-6">
<img src="/icons/nexbi/icon-nexbi-ok-light.svg" alt="NEXBi OK" width="48" height="48">
```

## Warianty kolorystyczne

### Line Icons — CSS color control (zero duplikacji plikow)

| Wariant | CSS class | Kolor | Kontekst |
|---------|-----------|-------|----------|
| `flame` | `text-nexbe-flame` | `#FF004E` | Ciemne tlo — primary |
| `light` | `text-nexbe-text` | `#F0E8FF` | Ciemne tlo — secondary |
| `dark` | `text-nexbe-deep` | `#230045` | Jasne tlo |
| `muted` | `text-nexbe-text-muted` | `rgba(240,232,255,0.7)` | Disabled |
| `inherit` | _(brak)_ | inherit | Kolor z rodzica |

### NEXBi Mini — 3 warianty SVG

| Wariant | Body | Eyes | Limbs | Plik |
|---------|------|------|-------|------|
| `default` | #350066 | #FF004E | #45007A | `icon-nexbi-*.svg` |
| `light` | #6B1A99 | #FF004E | #8A35CC | `icon-nexbi-*-light.svg` |
| `outlined` | stroke #F0E8FF | stroke #FF004E | stroke #F0E8FF | `icon-nexbi-*-outlined.svg` |

## Kolory

| Token | Hex | Uzycie |
|-------|-----|--------|
| flame | `#FF004E` | Line icons (currentColor), oczy NEXBi, akcenty |
| raspberry | `#B5005D` | Gradient, detale NEXBi |
| plum | `#350066` | Cialo NEXBi default |
| dark | `#230045` | Tla, wariant dark |
| text | `#F0E8FF` | Wariant light |
| neutral | `#CECEC0` | Tekst drugorzedny |

## Rozmiary

| Rozmiar | Uzycie |
|---------|--------|
| 24px | Inline, przyciski, listy |
| 32px | Karty, nawigacja |
| 48px | Sekcje USP, features |
| 64px | Hero, naglowki |

## Kategorie

### Line Icons (41)
- **Produkty** (10): magazyn-energii, fotowoltaika, ladowarka-ev, auto-elektryczne, falownik, retrofit, pompa-ciepla, smart-ems, instalacja-pv, system-hybrydowy
- **Finanse** (9): dotacja, moj-prad, oszczednosci, raty, roi, kalkulator, ulga-termomodernizacyjna, bezplatna-wycena, taryfa-dynamiczna
- **Energia/Tech** (11): energia-sloneczna, energia-nocna, siec-energetyczna, blackout-ochrona, monitoring-247, bateria-lfp, zywotnosc, pojemnosc-kwh, co2-redukcja, dom-energia, v2h
- **Zaufanie** (6): certyfikat, gwiazdki-opinie, gwarancja, instalatorzy, partner-keno, forbes-30u30
- **Ogolne** (5): dokumenty, klient, zespol, szkolenie, baza-wiedzy

### NEXBi Mini (19 x 3 warianty = 57 plikow)
- **Proces zakupu** (8): konfiguracja, doradca, wycena, umowa, dostawa, montaz, uruchomienie, serwis
- **Edukacja** (8): naukowiec, ekolog, superhero, pomysl, pytanie, ok, powitanie, prezentacja
- **Kontakt** (3): telefon, chat, formularz

## Integracja w appkach

Ikony sa zsynchronizowane do wszystkich appek via `sync-icons.sh`:
- landing_app (source of truth)
- handlowiec_app
- konfigurator_app
- mojprad_app
- contract-generator_app
- dashboard_app

Komponent `@nexbe/icons` (NexbeIcon) jest w `shared/icons/` i importowany przez tsconfig alias.
