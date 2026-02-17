import React from 'react';
import { Document, Page, Text, View, Font, Image } from '@react-pdf/renderer';
import { ContractData } from '@/types/contract';
import { formatAmount, formatDatePolish, getOSDName } from '@/lib/contract-helpers';
import { styles } from './styles';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular';
import { robotoBoldBase64 } from '@/lib/fonts/roboto-bold';
import { logoWhiteBase64 } from '@/lib/fonts/logo-white-base64';

// Register fonts
Font.register({
  family: 'Roboto',
  src: `data:font/truetype;base64,${robotoRegularBase64}`,
});
Font.register({
  family: 'Roboto-Bold',
  src: `data:font/truetype;base64,${robotoBoldBase64}`,
});

const NEXBE_FOOTER = 'Nexbe sp. z o.o. | ul. Stefana Batorego 18/108, 02-591 Warszawa | nexbe.pl | kontakt@nexbe.pl | +48 732 080 101';

interface Props {
  data: ContractData;
}

function FooterComponent() {
  return (
    <Text style={styles.footer}>{NEXBE_FOOTER}</Text>
  );
}

export function ContractPDF({ data }: Props) {
  const d = data;
  const inv = d.investmentAddress?.street ? d.investmentAddress : d.client?.address;
  const vatPercent = d.pricing?.vatRate || 8;
  const gross = d.pricing?.grossPrice || 0;
  const net = d.pricing?.netPrice || 0;
  const vat = d.pricing?.vatAmount || 0;

  return (
    <Document>
      {/* ═══════ PAGE 1: Header + Parties + §1 ═══════ */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logoWhiteBase64} style={{ width: 90, height: 28 }} />
          <View style={styles.headerRight}>
            <Text>Umowa nr {d.contractNumber}</Text>
            <Text>{formatDatePolish(d.contractDate)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>UMOWA NUMER {d.contractNumber}</Text>
        <Text style={styles.subtitle}>
          NA ROZBUDOWĘ INSTALACJI FOTOWOLTAICZNEJ O MAGAZYN ENERGII Z FALOWNIKIEM HYBRYDOWYM
        </Text>

        <Text style={styles.paragraph}>
          zawarta w dniu {formatDatePolish(d.contractDate)} w {d.contractCity || 'Warszawie'} pomiędzy:
        </Text>

        {/* Wykonawca */}
        <Text style={styles.partyHeader}>WYKONAWCA:</Text>
        <Text style={styles.paragraph}>
          Nexbe spółka z ograniczoną odpowiedzialnością z siedzibą w Warszawie
          przy ulicy Stefana Batorego 18/108, 02-591 Warszawa, wpisaną do rejestru
          przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0001174829,
          REGON 541818351, NIP 7011261848, kapitał zakładowy: 100 000,00 PLN,
          reprezentowaną przez Zarząd Spółki,
          zwaną dalej „Wykonawcą"
        </Text>

        <Text style={[styles.paragraph, { textAlign: 'center', marginVertical: 6 }]}>a</Text>

        {/* Zamawiający */}
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
          zwanym dalej „Zamawiającym", w dalszej części zwanymi łącznie „Stronami"
          bądź każde osobno „Stroną".
        </Text>

        {/* §1 */}
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
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a. Magazyn energii: {d.product?.brand} {d.product?.model} ({d.product?.batteryCapacity_kWh} kWh)</Text>
          <Text style={styles.paragraph}>b. Falownik hybrydowy: {d.product?.inverterModel} ({d.product?.inverterPower_kW} kW)</Text>
          <Text style={styles.paragraph}>c. System zarządzania energią: {d.product?.ems || 'KENO EMS'}</Text>
          <Text style={styles.paragraph}>d. Backup awaryjny (SZR): {d.product?.backupEPS ? 'Tak' : 'Nie'}</Text>
          {d.product?.additionalItems?.map((item, i) => (
            <Text key={i} style={styles.paragraph}>e. Dodatkowe: {item}</Text>
          ))}
        </View>

        <Text style={styles.paragraph}>
          6. W ramach realizacji Umowy Wykonawca zobowiązuje się wykonać następujące obowiązki:
        </Text>
        <View style={styles.indent}>
          <Text style={styles.paragraph}>a) wykonanie obmiaru technicznego niezbędnego do projektu rozbudowy;</Text>
          <Text style={styles.paragraph}>b) wykonanie projektu rozbudowy Instalacji przez Projektanta („Projekt");</Text>
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

        <FooterComponent />
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* ═══════ PAGE 2: §2 + §3 ═══════ */}
      <Page size="A4" style={styles.page}>
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

        <FooterComponent />
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* ═══════ PAGE 3: §4 + §5 + §6 + §7 ═══════ */}
      <Page size="A4" style={styles.page}>
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

        <FooterComponent />
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* ═══════ PAGE 4: §7 + Signatures ═══════ */}
      <Page size="A4" style={styles.page}>
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

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLine}>Wykonawca</Text>
            <Text style={{ fontSize: 8, color: '#999', marginTop: 3 }}>
              Zarząd Nexbe sp. z o.o.
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
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
