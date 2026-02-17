import React from 'react';
import { Document, Page, Text, View, Font, Image } from '@react-pdf/renderer';
import { ContractData } from '@/types/contract';
import { styles } from './styles';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular';
import { robotoBoldBase64 } from '@/lib/fonts/roboto-bold';
import { logoWhiteBase64 } from '@/lib/fonts/logo-white-base64';

Font.register({ family: 'Roboto', src: `data:font/truetype;base64,${robotoRegularBase64}` });
Font.register({ family: 'Roboto-Bold', src: `data:font/truetype;base64,${robotoBoldBase64}` });

const FOOTER = 'Nexbe sp. z o.o. | ul. Stefana Batorego 18/108, 02-591 Warszawa | nexbe.pl | kontakt@nexbe.pl | +48 732 080 101';

export function RODO_PDF({ data }: { data: ContractData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={`data:image/png;base64,${logoWhiteBase64}`} style={{ width: 90, height: 28 }} />
          <View style={styles.headerRight}>
            <Text>Załącznik nr 4 do Umowy {data.contractNumber}</Text>
          </View>
        </View>

        <Text style={[styles.title, { marginBottom: 20 }]}>KLAUZULA INFORMACYJNA RODO</Text>

        <Text style={styles.paragraph}>
          Zgodnie z art. 13 ust. 1 i 2 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679
          z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem
          danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy
          95/46/WE (ogólne rozporządzenie o ochronie danych, dalej „RODO"), informujemy, że:
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

        <Text style={styles.footer}>{FOOTER}</Text>
      </Page>
    </Document>
  );
}
