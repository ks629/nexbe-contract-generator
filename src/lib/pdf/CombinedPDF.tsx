import React from 'react';
import { Document, Page, Text, View, Font, Image } from '@react-pdf/renderer';
import { ContractData } from '@/types/contract';
import { formatAmount, formatDatePolish, getOSDName } from '@/lib/contract-helpers';
import { styles } from './styles';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular';
import { robotoBoldBase64 } from '@/lib/fonts/roboto-bold';
import { logoWhiteBase64 } from '@/lib/fonts/logo-white-base64';

// Register fonts (once)
Font.register({ family: 'Roboto', src: `data:font/truetype;base64,${robotoRegularBase64}` });
Font.register({ family: 'Roboto-Bold', src: `data:font/truetype;base64,${robotoBoldBase64}` });

const NEXBE_FOOTER = 'Nexbe sp. z o.o. | ul. Stefana Batorego 18/108, 02-591 Warszawa | nexbe.pl | kontakt@nexbe.pl | +48 732 080 101';

function FooterComponent() {
  return <Text style={styles.footer} fixed>{NEXBE_FOOTER}</Text>;
}

function PageNum() {
  return (
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      fixed
    />
  );
}

function Header({ right }: { right: string }) {
  return (
    <View style={styles.header} fixed>
      <Image src={logoWhiteBase64} style={{ width: 90, height: 28 }} />
      <View style={styles.headerRight}>
        <Text>{right}</Text>
      </View>
    </View>
  );
}

function getSubsidyProgramName(program?: string): string {
  switch (program) {
    case 'MOJ_PRAD': return 'Program \u201eMój Prąd\u201d (aktualna edycja)';
    case 'CZYSTE_POWIETRZE': return 'Program \u201eCzyste Powietrze\u201d';
    default: return 'Program dofinansowania NFOŚiGW';
  }
}

// ═══════════════════════════════════════════════
// Combined PDF — Contract + Attachments in one Document
// ═══════════════════════════════════════════════
export function CombinedPDF({ data }: { data: ContractData }) {
  const d = data;
  const inv = d.investmentAddress?.street ? d.investmentAddress : d.client?.address;
  const vatPercent = d.pricing?.vatRate || 8;
  const gross = d.pricing?.grossPrice || 0;
  const net = d.pricing?.netPrice || 0;
  const vat = d.pricing?.vatAmount || 0;
  const osdName = d.existingPV?.osd ? getOSDName(d.existingPV.osd) : '_______________';
  const salesRepName = d.salesRep?.fullName || '_______________';
  const salesRepPosition = d.salesRep?.position || 'Przedstawiciel handlowy';

  return (
    <Document>
      {/* ═══════ CONTRACT — all sections in one flowing page ═══════ */}
      <Page size="A4" style={styles.page} wrap>
        <Header right={`Umowa nr ${d.contractNumber}\n${formatDatePolish(d.contractDate)}`} />

        <Text style={styles.title}>UMOWA NUMER {d.contractNumber}</Text>
        <Text style={styles.subtitle}>
          NA ROZBUDOWĘ INSTALACJI FOTOWOLTAICZNEJ O MAGAZYN ENERGII Z FALOWNIKIEM HYBRYDOWYM
        </Text>

        <Text style={styles.paragraph}>
          zawarta w dniu {formatDatePolish(d.contractDate)} w {d.contractCity || 'Warszawie'} pomiędzy:
        </Text>

        <Text style={styles.partyHeader}>WYKONAWCA:</Text>
        <Text style={styles.paragraph}>
          Nexbe spółka z ograniczoną odpowiedzialnością z siedzibą w Warszawie
          przy ulicy Stefana Batorego 18/108, 02-591 Warszawa, wpisaną do rejestru
          przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0001174829,
          REGON 541818351, NIP 7011261848, kapitał zakładowy: 100 000,00 PLN,
          reprezentowaną przez: {salesRepName} — {salesRepPosition}, na podstawie pełnomocnictwa udzielonego przez Zarząd Spółki,
          zwaną dalej \u201eWykonawcą\u201d
        </Text>

        <Text style={[styles.paragraph, { textAlign: 'center', marginVertical: 6 }]}>a</Text>

        <Text style={styles.partyHeader}>ZAMAWIAJĄCY:</Text>
        <Text style={styles.paragraph}>
          {d.client?.fullName || '_______________'},{' '}
          zamieszkałym/ą przy {d.client?.address?.street || '_______________'},{' '}
          {d.client?.address?.postalCode || '______'} {d.client?.address?.city || '_______________'}
          {d.client?.pesel ? `, PESEL: ${d.client.pesel}` : ''}
          {d.client?.nip ? `, NIP: ${d.client.nip}` : ''},{' '}
          tel.: {d.client?.phone || '_______________'}, e-mail: {d.client?.email || '_______________'},
        </Text>

        {d.coOwner?.fullName && (
          <Text style={styles.paragraph}>
            oraz {d.coOwner.fullName}, zamieszkałym/ą przy {d.coOwner.address?.street || '_______________'},{' '}
            {d.coOwner.address?.postalCode} {d.coOwner.address?.city}
            {d.coOwner.pesel ? `, PESEL: ${d.coOwner.pesel}` : ''},{' '}
            tel.: {d.coOwner.phone}, e-mail: {d.coOwner.email},
          </Text>
        )}

        <Text style={styles.paragraph}>
          zwanym dalej \u201eZamawiającym\u201d, w dalszej części zwanymi łącznie \u201eStronami\u201d
          bądź każde osobno \u201eStroną\u201d.
        </Text>

        {/* ─── §1 ─── */}
        <Text style={styles.sectionTitle}>§ 1. PRZEDMIOT UMOWY</Text>

        <Text style={styles.paragraph}>
          1. Zamawiający zleca, a Wykonawca zobowiązuje się do rozbudowy istniejącej
          instalacji fotowoltaicznej o magazyn energii z falownikiem hybrydowym na
          nieruchomości położonej przy ulicy {inv?.street || '_______________'},{' '}
          kod pocztowy {inv?.postalCode || '______'}, w miejscowości {inv?.city || '_______________'}.
        </Text>
        <Text style={styles.paragraph}>
          2. Rozbudowa wykonana będzie z materiałów dostarczonych przez Wykonawcę.
        </Text>
        <Text style={styles.paragraph}>
          3. Zamawiający oświadcza, że jest właścicielem, współwłaścicielem, użytkownikiem
          wieczystym nieruchomości lub posiada inny tytuł prawny do nieruchomości i jest
          w pełni umocowany do dysponowania nieruchomością w celu realizacji niniejszej Umowy.
        </Text>
        <Text style={styles.paragraph}>
          4. Zamawiający oświadcza, że posiada działającą instalację fotowoltaiczną
          o mocy {d.existingPV?.power_kWp || '___'} kWp z falownikiem {d.existingPV?.inverterBrand || '___'} {d.existingPV?.inverterModel || '___'}.
        </Text>
        <Text style={styles.paragraph}>
          5. Wykonawca zobowiązuje się do dostarczenia i montażu następującego zestawu
          wybranego przez Zamawiającego:
        </Text>
        <View style={styles.highlightBox}>
          <Text style={styles.paragraph}>a. Magazyn energii: {d.product?.brand} {d.product?.model} ({d.product?.batteryCapacity_kWh} kWh)</Text>
          <Text style={styles.paragraph}>b. Falownik hybrydowy: {d.product?.inverterModel} ({d.product?.inverterPower_kW} kW)</Text>
          <Text style={styles.paragraph}>c. System zarządzania energią: {d.product?.ems || 'KENO EMS'}</Text>
          <Text style={styles.paragraph}>d. Backup awaryjny (SZR): {d.product?.backupEPS ? 'Tak' : 'Nie'}</Text>
          {d.product?.additionalItems?.map((item, i) => (
            <Text key={i} style={styles.paragraph}>e. Dodatkowe: {item}</Text>
          ))}
        </View>

        {/* Meter owner if different from client */}
        {d.meterOwner?.fullName && d.meterOwner.fullName !== d.client?.fullName && (
          <View style={[styles.highlightBox, { marginTop: 6 }]}>
            <Text style={[styles.paragraph, { fontFamily: 'Roboto-Bold' }]}>
              Właściciel licznika (jeśli inny niż Zamawiający):
            </Text>
            <Text style={styles.paragraph}>
              {d.meterOwner.fullName}
              {d.meterOwner.pesel ? `, PESEL: ${d.meterOwner.pesel}` : ''}
              {d.meterOwner.address?.street ? `, zam. ${d.meterOwner.address.street}, ${d.meterOwner.address.postalCode || ''} ${d.meterOwner.address.city || ''}` : ''}
            </Text>
          </View>
        )}

        {/* PPE number */}
        {d.ppeNumber && (
          <Text style={styles.paragraph}>
            Numer Punktu Poboru Energii (PPE): {d.ppeNumber}
          </Text>
        )}

        <Text style={styles.paragraph}>
          6. W ramach realizacji Umowy Wykonawca zobowiązuje się wykonać następujące obowiązki:
        </Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a) wykonanie obmiaru technicznego niezbędnego do projektu rozbudowy;</Text>
          <Text style={styles.paragraph}>b) wykonanie projektu rozbudowy Instalacji przez Projektanta (\u201eProjekt\u201d);</Text>
          <Text style={styles.paragraph}>c) dostarczenie komponentów na miejsce inwestycji;</Text>
          <Text style={styles.paragraph}>d) wykonanie demontażu dotychczasowego falownika (jeśli dotyczy);</Text>
          <Text style={styles.paragraph}>e) montaż magazynu energii, falownika hybrydowego i systemu EMS zgodnie z Projektem;</Text>
          <Text style={styles.paragraph}>f) konfiguracja systemu zarządzania energią i aplikacji monitorującej;</Text>
          <Text style={styles.paragraph}>g) rozruch, pomiary i testy Instalacji;</Text>
          <Text style={styles.paragraph}>h) szkolenie Zamawiającego z zasad działania systemu oraz BHP;</Text>
          <Text style={styles.paragraph}>
            i) pomoc w przygotowaniu/złożeniu wniosku o przyłączenie mikroinstalacji do sieci
            elektroenergetycznej (zmiana/aktualizacja zgłoszenia) — pod warunkiem udzielenia
            pełnomocnictwa OSD;
          </Text>
          <Text style={styles.paragraph}>
            j) pomoc w przygotowaniu wniosku o dofinansowanie w ramach programów NFOŚiGW
            (Mój Prąd 6.0) — pod warunkiem udzielenia pełnomocnictwa.
          </Text>
        </View>

        {/* ─── §2 ─── */}
        <Text style={styles.sectionTitle}>§ 2. WYNAGRODZENIE</Text>

        <Text style={styles.paragraph}>
          1. Dla celów ustalenia właściwej stawki podatku VAT, Zamawiający oświadcza,
          że montaż ma miejsce na budynku mieszkalnym jednorodzinnym
          {d.declarations?.buildingType === 'RESIDENTIAL_UNDER_300'
            ? ' o powierzchni użytkowej do 300 m² — stawka VAT wynosi 8%.'
            : d.declarations?.buildingType === 'NON_RESIDENTIAL'
            ? ', przy czym energia zasila wyłącznie budynki inne niż mieszkalne — stawka VAT wynosi 23%.'
            : ` o powierzchni ${d.declarations?.buildingArea_m2 || '___'} m² — stawka mieszana 8%/23%.`
          }
        </Text>

        <Text style={styles.paragraph}>
          2. Wynagrodzenie Wykonawcy z tytułu kompleksowego wykonania Przedmiotu Umowy wynosi:
        </Text>
        <Text style={styles.amountHighlight}>
          {formatAmount(net)} zł netto + VAT {vatPercent}% ({formatAmount(vat)} zł) = {formatAmount(gross)} zł brutto
        </Text>

        <Text style={styles.paragraph}>
          3. Zamawiający oświadcza, że Umowa będzie finansowana{' '}
          {d.pricing?.financing === 'OWN_FUNDS'
            ? 'ze środków własnych Zamawiającego.'
            : d.pricing?.financing === 'CREDIT'
            ? 'z kredytu bankowego.'
            : 'w formie leasingu.'}
          {(d.pricing?.financing === 'CREDIT' || d.pricing?.financing === 'LEASING') &&
            d.pricing?.ownContribution && d.pricing.ownContribution > 0
            ? ` Wkład własny Zamawiającego wynosi: ${formatAmount(d.pricing.ownContribution)} zł brutto.`
            : ''}
        </Text>

        <Text style={styles.paragraph}>
          4. Płatności na rzecz Wykonawcy dokonywane będą wyłącznie na rachunek bankowy:
        </Text>
        <Text style={[styles.paragraphBold, styles.indent]}>
          55 1020 1169 0000 8202 0927 8401 (PKO BP)
        </Text>
        <Text style={[styles.paragraph, styles.indent]}>
          z zastrzeżeniem, że w przypadku Zamawiającego będącego podatnikiem VAT —
          z zastosowaniem mechanizmu podzielonej płatności (split payment).
          W tytule przelewu należy wskazać numer Umowy oraz dane Zamawiającego.
          Wykonawca nie przyjmuje płatności w gotówce.
        </Text>

        {d.pricing?.financing === 'OWN_FUNDS' ? (
          <>
            <Text style={styles.paragraph}>5. Harmonogram płatności (środki własne):</Text>
            <View style={styles.indent}>
              <Text style={styles.paragraph}>
                Transza 1: 30% Wynagrodzenia brutto ({formatAmount(d.pricing?.tranches?.t1_amount || 0)} zł) — w terminie 3 dni od podpisania Umowy;
              </Text>
              <Text style={styles.paragraph}>
                Transza 2: 60% Wynagrodzenia brutto ({formatAmount(d.pricing?.tranches?.t2_amount || 0)} zł) — w terminie 3 dni od dostarczenia komponentów;
              </Text>
              <Text style={styles.paragraph}>
                Transza 3: 10% Wynagrodzenia brutto ({formatAmount(d.pricing?.tranches?.t3_amount || 0)} zł) — w terminie 3 dni od zakończenia prac montażowych.
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.paragraph}>
              5. Płatność Wynagrodzenia zostanie dokonana przez instytucję finansującą ({d.pricing?.financing === 'CREDIT' ? 'bank kredytujący' : 'firmę leasingową'}) bezpośrednio na rachunek bankowy Wykonawcy,
              zgodnie z harmonogramem ustalonym pomiędzy Zamawiającym a instytucją finansującą.
            </Text>
            {d.pricing?.ownContribution && d.pricing.ownContribution > 0 && (
              <Text style={styles.paragraph}>
                Wkład własny w kwocie {formatAmount(d.pricing.ownContribution)} zł brutto płatny na rachunek Wykonawcy
                w terminie 3 dni od podpisania Umowy.
              </Text>
            )}
          </>
        )}

        <Text style={styles.paragraph}>
          6. W przypadku niezgodności oświadczenia VAT ze stanem faktycznym, Wykonawca wystawi
          fakturę korygującą, a Zamawiający zobowiązany będzie do zapłaty różnicy.
        </Text>

        {/* ─── §3 ─── */}
        <Text style={styles.sectionTitle}>§ 3. REALIZACJA PRAC</Text>
        <Text style={styles.paragraph}>
          1. Szczegółowe ustalenia techniczne zostaną zawarte w Arkuszu Ustaleń Montażowych (AUM)
          podpisanym przez Zamawiającego i Wykonawcę. AUM stanowi integralną część Umowy.
          Zmiana danych zawartych w AUM potwierdzona przez Strony w formie dokumentowej,
          w tym w uzgodnionym Projekcie, nie stanowi zmiany Umowy.
        </Text>
        <Text style={styles.paragraph}>
          2. Termin zakończenia prac montażowych: do 60 dni od daty {d.pricing?.financing === 'OWN_FUNDS'
            ? 'zaksięgowania II transzy Wynagrodzenia na rachunku bankowym Wykonawcy'
            : 'zaksięgowania płatności (lub wkładu własnego) na rachunku bankowym Wykonawcy'}{' '}
          oraz zaakceptowania Projektu
          przez Zamawiającego, w zależności od tego, które zdarzenie nastąpiło później.
        </Text>
        <Text style={styles.paragraph}>
          3. W przypadku opóźnienia Zamawiającego w realizacji obowiązków (np. akceptacji Projektu,
          udostępnienia nieruchomości), termin zakończenia prac ulega proporcjonalnemu wydłużeniu.
        </Text>
        <Text style={styles.paragraph}>
          4. Zamawiający zobowiązany jest zaakceptować lub wnieść uwagi do przesłanego Projektu
          w terminie 5 dni od dnia jego wpływu na pocztę elektroniczną. Po upływie terminu
          Projekt uznaje się za zaakceptowany bez uwag.
        </Text>
        <Text style={styles.paragraph}>
          5. Datą zakończenia prac montażowych jest dzień podpisania Protokołu Odbioru.
        </Text>
        <Text style={styles.paragraph}>
          6. Wykonawca może korzystać z certyfikowanych partnerów (podwykonawców).
        </Text>
        <Text style={styles.paragraph}>
          7. Wykonawca nie ponosi odpowiedzialności za opóźnienia z przyczyn od niego niezależnych.
        </Text>

        {/* ─── §4 ─── */}
        <Text style={styles.sectionTitle}>§ 4. GWARANCJE</Text>
        <Text style={styles.paragraph}>
          1. Poszczególne komponenty objęte są gwarancją producentów zgodnie z kartami gwarancyjnymi.
          Gwarancja producenta na magazyn energii: minimum 10 lat.
          Gwarancja producenta na falownik hybrydowy: minimum 10 lat.
        </Text>
        <Text style={styles.paragraph}>
          2. Wykonawca udziela 3-letniej gwarancji jakości prac montażowych
          liczonej od dnia podpisania Protokołu Odbioru.
        </Text>
        <Text style={styles.paragraph}>3. Gwarancja nie obejmuje:</Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a) ingerencji osób trzecich w Instalację bez uzgodnienia z Wykonawcą;</Text>
          <Text style={styles.paragraph}>b) użytkowania niezgodnego z przeznaczeniem lub instrukcją;</Text>
          <Text style={styles.paragraph}>c) uszkodzeń mechanicznych i skutków siły wyższej;</Text>
          <Text style={styles.paragraph}>d) naturalnego zużycia komponentów.</Text>
        </View>
        <Text style={styles.paragraph}>
          4. Zgłoszenia serwisowe: serwis@nexbe.pl lub tel. +48 732 080 101.
        </Text>

        {/* ─── §5 ─── */}
        <Text style={styles.sectionTitle}>§ 5. OBOWIĄZKI ZAMAWIAJĄCEGO</Text>
        <Text style={styles.paragraph}>1. Zamawiający zobowiązuje się w szczególności do:</Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a) terminowego uiszczania płatności;</Text>
          <Text style={styles.paragraph}>b) udostępnienia nieruchomości Wykonawcy w celu montażu, audytu, serwisu — w terminie do 7 dni od zgłoszenia;</Text>
          <Text style={styles.paragraph}>c) udostępnienia danych technicznych dotyczących istniejącej instalacji PV i instalacji elektrycznej budynku;</Text>
          <Text style={styles.paragraph}>d) zaakceptowania Projektu w terminie 5 dni;</Text>
          <Text style={styles.paragraph}>e) zapewnienia bezpiecznego miejsca składowania komponentów;</Text>
          <Text style={styles.paragraph}>f) podpisania Protokołu Odbioru po zakończeniu prac;</Text>
          <Text style={styles.paragraph}>g) zawiadomienia Wykonawcy o usterkach niezwłocznie po ich zauważeniu.</Text>
        </View>
        <Text style={styles.paragraph}>
          2. Zamawiający oświadcza, że w momencie zgłoszenia przyłączenia mikroinstalacji
          jego przyłącze umożliwia przyłączenie lub zapewni we własnym zakresie
          jego dostosowanie (np. zwiększenie mocy przyłączeniowej).
        </Text>
        <Text style={styles.paragraph}>
          3. Zamawiający oświadcza, że instalacja elektryczna w budynku jest wykonana
          zgodnie z obowiązującymi przepisami.
        </Text>

        {/* ─── §6 ─── */}
        <Text style={styles.sectionTitle}>§ 6. ODSTĄPIENIE OD UMOWY</Text>
        <Text style={styles.paragraph}>
          1. Każda ze Stron może odstąpić od Umowy za zapłatą odstępnego w wysokości
          20% Wynagrodzenia — najpóźniej na dzień przed wysłaniem komponentów na miejsce montażu.
        </Text>
        <Text style={styles.paragraph}>2. Wykonawca może odstąpić od Umowy w terminie 180 dni od jej zawarcia:</Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a) w przypadku zalegania Zamawiającego z płatnością powyżej 14 dni;</Text>
          <Text style={styles.paragraph}>b) gdy z przyczyn technicznych realizacja nie jest możliwa;</Text>
          <Text style={styles.paragraph}>c) w przypadku braku współdziałania Zamawiającego uniemożliwiającego realizację Umowy — po udzieleniu dodatkowego 14-dniowego terminu.</Text>
        </View>
        <Text style={styles.paragraph}>
          3. W przypadku odstąpienia, Zamawiający zobowiązany jest zwrócić mienie Wykonawcy
          w stanie kompletnym w terminie 14 dni oraz zapłacić za prace wykonane.
        </Text>

        {/* ─── §7 ─── */}
        <Text style={styles.sectionTitle}>§ 7. POSTANOWIENIA KOŃCOWE</Text>
        <Text style={styles.paragraph}>
          1. Przeniesienie praw/obowiązków wymaga uprzedniej zgody drugiej Strony.
          Przeniesienie wierzytelności nie wymaga zgody drugiej Strony.
        </Text>
        <Text style={styles.paragraph}>
          2. Wszelkie zmiany Umowy wymagają formy pisemnej, elektronicznej lub dokumentowej,
          w tym oświadczeń woli opatrzonych podpisem elektronicznym
          (zwykłym, zaawansowanym — w tym za pośrednictwem Autenti).
        </Text>
        <Text style={styles.paragraph}>3. Integralną częścią Umowy są:</Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>– Załącznik nr 1: Arkusz Ustaleń Montażowych (AUM)</Text>
          <Text style={styles.paragraph}>– Załącznik nr 2: Pełnomocnictwo do zgłoszenia przyłączenia mikroinstalacji (OSD)</Text>
          <Text style={styles.paragraph}>– Załącznik nr 3: Pełnomocnictwo do złożenia wniosku o dofinansowanie NFOŚiGW</Text>
          <Text style={styles.paragraph}>– Załącznik nr 4: Klauzula informacyjna RODO</Text>
        </View>
        <Text style={styles.paragraph}>
          4. Zamawiający {d.declarations?.electronicInvoices ? 'wyraża' : 'nie wyraża'} zgody na przesyłanie faktur elektronicznych.
        </Text>
        <Text style={styles.paragraph}>
          5. Zamawiający oświadcza, że spotkanie z Wykonawcą{' '}
          {d.declarations?.meetingType === 'SCHEDULED' ? 'było wcześniej umówione.' :
           d.declarations?.meetingType === 'UNSCHEDULED' ? 'nie było wcześniej umówione.' :
           'nie dotyczy (umowa zawierana na odległość).'}
        </Text>
        <Text style={styles.paragraph}>
          6. W sprawach nieuregulowanych — przepisy Kodeksu Cywilnego.
          Spory — sąd powszechny właściwy dla siedziby Wykonawcy.
        </Text>
        <Text style={styles.paragraph}>
          7. Umowę sporządzono w dwóch jednakowo brzmiących egzemplarzach
          (lub w formie elektronicznej za pośrednictwem Autenti).
        </Text>

        {/* Additional notes */}
        {d.additionalNotes && (
          <View style={[styles.highlightBox, { marginTop: 10 }]}>
            <Text style={[styles.paragraph, { fontFamily: 'Roboto-Bold', marginBottom: 2 }]}>
              Uwagi dodatkowe:
            </Text>
            <Text style={styles.paragraph}>{d.additionalNotes}</Text>
          </View>
        )}

        {/* ─── Signatures ─── */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>Wykonawca</Text>
            <Text style={{ fontSize: 8, color: '#999', marginTop: 3 }}>
              {salesRepName}
            </Text>
            <Text style={{ fontSize: 7, color: '#bbb', marginTop: 1 }}>
              Nexbe sp. z o.o.
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>Zamawiający</Text>
            <Text style={{ fontSize: 8, color: '#999', marginTop: 3 }}>
              {d.client?.fullName}
            </Text>
          </View>
        </View>

        <FooterComponent />
        <PageNum />
      </Page>

      {/* ═══════ ATTACHMENT: POA OSD (Załącznik nr 2) ═══════ */}
      {d.attachments?.poaOSD && (
        <Page size="A4" style={styles.page} wrap>
          <Header right={`Załącznik nr 2 do Umowy ${d.contractNumber}`} />

          <Text style={[styles.title, { marginBottom: 20 }]}>PEŁNOMOCNICTWO</Text>
          <Text style={[styles.subtitle, { marginBottom: 5 }]}>
            do zgłoszenia przyłączenia/aktualizacji zgłoszenia mikroinstalacji
          </Text>

          <Text style={[styles.paragraph, { marginTop: 15 }]}>Ja niżej podpisany/a:</Text>

          <View style={[styles.indent, { marginTop: 10, marginBottom: 15 }]}>
            <View style={styles.row}><Text style={styles.label}>Imię i nazwisko:</Text><Text style={styles.value}>{d.client?.fullName || '_______________'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>PESEL:</Text><Text style={styles.value}>{d.client?.pesel || '_______________'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Adres:</Text><Text style={styles.value}>{d.client?.address?.street}, {d.client?.address?.postalCode} {d.client?.address?.city}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Nr telefonu:</Text><Text style={styles.value}>{d.client?.phone || '_______________'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>E-mail:</Text><Text style={styles.value}>{d.client?.email || '_______________'}</Text></View>
          </View>

          <Text style={styles.paragraph}>niniejszym udzielam pełnomocnictwa firmie:</Text>
          <Text style={[styles.paragraphBold, { marginVertical: 8 }]}>
            Nexbe sp. z o.o., ul. Stefana Batorego 18/108, 02-591 Warszawa, NIP 7011261848, KRS 0001174829
          </Text>
          <Text style={styles.paragraph}>
            reprezentowanej przez: {salesRepName} — {salesRepPosition}, na podstawie pełnomocnictwa udzielonego przez Zarząd Spółki
          </Text>

          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            do działania w moim imieniu i na moją rzecz w zakresie:
          </Text>

          <View style={[styles.indent, { marginTop: 8 }]}>
            <Text style={styles.paragraph}>
              1. Złożenia zgłoszenia przyłączenia/aktualizacji zgłoszenia mikroinstalacji
              do sieci elektroenergetycznej u właściwego Operatora Systemu Dystrybucyjnego (OSD):
            </Text>
            <Text style={[styles.paragraphBold, styles.indent]}>{osdName}</Text>

            {d.existingPV?.needsPowerIncrease && (
              <Text style={styles.paragraph}>
                2. Złożenia wniosku o zwiększenie mocy przyłączeniowej z obecnej{' '}
                {d.existingPV.currentConnectionPower_kW || '___'} kW do{' '}
                {d.existingPV.targetConnectionPower_kW || '___'} kW.
              </Text>
            )}

            <Text style={styles.paragraph}>
              {d.existingPV?.needsPowerIncrease ? '3' : '2'}. Podpisywania w moim imieniu wszelkich dokumentów, wniosków, oświadczeń
              i formularzy niezbędnych do realizacji powyższych czynności.
            </Text>
            <Text style={styles.paragraph}>
              {d.existingPV?.needsPowerIncrease ? '4' : '3'}. Odbioru wszelkiej korespondencji związanej z powyższymi sprawami.
            </Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 15 }]}>
            Pełnomocnictwo jest ważne od dnia podpisania do dnia zakończenia procedury
            przyłączeniowej, nie dłużej jednak niż 12 miesięcy od daty udzielenia.
          </Text>
          <Text style={styles.paragraph}>
            Pełnomocnictwo obejmuje prawo do udzielania dalszych pełnomocnictw (substytucji).
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLine}>Miejscowość, data</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLine}>Podpis Mocodawcy</Text>
              <Text style={{ fontSize: 7, color: '#999', marginTop: 3 }}>{d.client?.fullName}</Text>
            </View>
          </View>

          <FooterComponent />
          <PageNum />
        </Page>
      )}

      {/* ═══════ ATTACHMENT: POA Subsidy (Załącznik nr 3) ═══════ */}
      {d.attachments?.poaSubsidy && (
        <Page size="A4" style={styles.page} wrap>
          <Header right={`Załącznik nr 3 do Umowy ${d.contractNumber}`} />

          <Text style={[styles.title, { marginBottom: 20 }]}>PEŁNOMOCNICTWO</Text>
          <Text style={[styles.subtitle, { marginBottom: 5 }]}>
            do złożenia wniosku o dofinansowanie NFOŚiGW
          </Text>

          <Text style={[styles.paragraph, { marginTop: 15 }]}>Ja niżej podpisany/a:</Text>

          <View style={[styles.indent, { marginTop: 10, marginBottom: 15 }]}>
            <View style={styles.row}><Text style={styles.label}>Imię i nazwisko:</Text><Text style={styles.value}>{d.client?.fullName || '_______________'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>PESEL:</Text><Text style={styles.value}>{d.client?.pesel || '_______________'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Adres:</Text><Text style={styles.value}>{d.client?.address?.street}, {d.client?.address?.postalCode} {d.client?.address?.city}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Nr telefonu:</Text><Text style={styles.value}>{d.client?.phone || '_______________'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>E-mail:</Text><Text style={styles.value}>{d.client?.email || '_______________'}</Text></View>
          </View>

          <Text style={styles.paragraph}>niniejszym udzielam pełnomocnictwa firmie:</Text>
          <Text style={[styles.paragraphBold, { marginVertical: 8 }]}>
            Nexbe sp. z o.o., ul. Stefana Batorego 18/108, 02-591 Warszawa, NIP 7011261848, KRS 0001174829
          </Text>
          <Text style={styles.paragraph}>
            reprezentowanej przez: {salesRepName} — {salesRepPosition}, na podstawie pełnomocnictwa udzielonego przez Zarząd Spółki
          </Text>

          <Text style={[styles.paragraph, { marginTop: 12 }]}>
            do działania w moim imieniu i na moją rzecz w zakresie:
          </Text>

          <View style={[styles.indent, { marginTop: 8 }]}>
            <Text style={styles.paragraph}>
              1. Złożenia wniosku o dofinansowanie w ramach programów
              Narodowego Funduszu Ochrony Środowiska i Gospodarki Wodnej (NFOŚiGW):
            </Text>
            <Text style={[styles.paragraphBold, styles.indent]}>
              {getSubsidyProgramName(d.attachments?.subsidyProgram)}
            </Text>

            <Text style={styles.paragraph}>
              2. Przygotowania i złożenia kompletnej dokumentacji wymaganej
              przez w/w program dofinansowania.
            </Text>
            <Text style={styles.paragraph}>
              3. Prowadzenia korespondencji z NFOŚiGW oraz WFOŚiGW
              w zakresie złożonego wniosku.
            </Text>
            <Text style={styles.paragraph}>
              4. Uzupełniania i korygowania dokumentacji wniosku
              na wezwanie instytucji udzielającej dofinansowania.
            </Text>
            <Text style={styles.paragraph}>
              5. Odbioru wszelkiej korespondencji związanej z wnioskiem o dofinansowanie.
            </Text>
          </View>

          <View style={[styles.warningBox, { marginTop: 15 }]}>
            <Text style={[styles.paragraph, { fontFamily: 'Roboto-Bold', marginBottom: 0 }]}>
              Pełnomocnictwo NIE obejmuje odbioru środków z dofinansowania — środki wypłacane
              są bezpośrednio na rachunek bankowy Mocodawcy.
            </Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 8 }]}>
            Pełnomocnictwo jest ważne od dnia podpisania do dnia zakończenia procedury
            rozliczenia dofinansowania, nie dłużej jednak niż 24 miesiące od daty udzielenia.
          </Text>
          <Text style={styles.paragraph}>
            Pełnomocnictwo obejmuje prawo do udzielania dalszych pełnomocnictw (substytucji).
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLine}>Miejscowość, data</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLine}>Podpis Mocodawcy</Text>
              <Text style={{ fontSize: 7, color: '#999', marginTop: 3 }}>{d.client?.fullName}</Text>
            </View>
          </View>

          <FooterComponent />
          <PageNum />
        </Page>
      )}

      {/* ═══════ ATTACHMENT: RODO (Załącznik nr 4) ═══════ */}
      <Page size="A4" style={styles.page} wrap>
        <Header right={`Załącznik nr 4 do Umowy ${d.contractNumber}`} />

        <Text style={[styles.title, { marginBottom: 20 }]}>KLAUZULA INFORMACYJNA RODO</Text>

        <Text style={styles.paragraph}>
          Zgodnie z art. 13 ust. 1 i 2 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679
          z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem
          danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy
          95/46/WE (ogólne rozporządzenie o ochronie danych, dalej \u201eRODO\u201d), informujemy, że:
        </Text>

        <Text style={[styles.paragraphBold, { marginTop: 12 }]}>1. Administrator danych osobowych</Text>
        <Text style={styles.paragraph}>
          Administratorem Pani/Pana danych osobowych jest Nexbe sp. z o.o. z siedzibą w Warszawie,
          ul. Stefana Batorego 18/108, 02-591 Warszawa, KRS 0001174829, NIP 7011261848.
          Kontakt: rodo@nexbe.pl.
        </Text>

        <Text style={[styles.paragraphBold, { marginTop: 8 }]}>2. Cel i podstawa przetwarzania</Text>
        <Text style={styles.paragraph}>
          Pani/Pana dane osobowe przetwarzane będą w celu:
        </Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a) realizacji Umowy — na podstawie art. 6 ust. 1 lit. b) RODO;</Text>
          <Text style={styles.paragraph}>b) wypełnienia obowiązków prawnych ciążących na Administratorze — na podstawie art. 6 ust. 1 lit. c) RODO;</Text>
          <Text style={styles.paragraph}>c) realizacji prawnie uzasadnionych interesów Administratora (dochodzenie roszczeń) — na podstawie art. 6 ust. 1 lit. f) RODO.</Text>
        </View>

        <Text style={[styles.paragraphBold, { marginTop: 8 }]}>3. Odbiorcy danych</Text>
        <Text style={styles.paragraph}>
          Odbiorcami danych mogą być: podwykonawcy realizujący montaż, operatorzy systemów
          dystrybucyjnych (OSD), instytucje finansujące (NFOŚiGW, WFOŚiGW), podmioty świadczące
          usługi IT, księgowe i prawne na rzecz Administratora.
        </Text>

        <Text style={[styles.paragraphBold, { marginTop: 8 }]}>4. Okres przechowywania</Text>
        <Text style={styles.paragraph}>
          Dane będą przechowywane przez okres realizacji Umowy, a następnie przez okres wymagany
          przepisami prawa podatkowego i okres przedawnienia roszczeń.
        </Text>

        <Text style={[styles.paragraphBold, { marginTop: 8 }]}>5. Prawa osoby, której dane dotyczą</Text>
        <Text style={styles.paragraph}>
          Przysługuje Pani/Panu prawo do: dostępu do danych, sprostowania, usunięcia,
          ograniczenia przetwarzania, przenoszenia danych, wniesienia sprzeciwu wobec przetwarzania,
          a także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).
        </Text>

        <Text style={[styles.paragraphBold, { marginTop: 8 }]}>6. Informacja o wymogu podania danych</Text>
        <Text style={styles.paragraph}>
          Podanie danych osobowych jest dobrowolne, lecz niezbędne do zawarcia i realizacji Umowy.
          Brak podania danych uniemożliwi zawarcie Umowy.
        </Text>

        <Text style={[styles.paragraphBold, { marginTop: 8 }]}>7. Kontakt</Text>
        <Text style={styles.paragraph}>
          W sprawach dotyczących przetwarzania danych osobowych prosimy o kontakt:
          rodo@nexbe.pl lub pisemnie na adres siedziby Administratora.
        </Text>

        <FooterComponent />
        <PageNum />
      </Page>
    </Document>
  );
}
