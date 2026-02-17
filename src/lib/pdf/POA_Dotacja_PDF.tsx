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

function getSubsidyProgramName(program?: string): string {
  switch (program) {
    case 'MOJ_PRAD': return 'Program „Mój Prąd" (aktualna edycja)';
    case 'CZYSTE_POWIETRZE': return 'Program „Czyste Powietrze"';
    default: return 'Program dofinansowania NFOŚiGW';
  }
}

export function POA_Dotacja_PDF({ data }: { data: ContractData }) {
  const d = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={`data:image/png;base64,${logoWhiteBase64}`} style={{ width: 90, height: 28 }} />
          <View style={styles.headerRight}>
            <Text>Załącznik nr 3 do Umowy {d.contractNumber}</Text>
          </View>
        </View>

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
          reprezentowanej przez: {d.salesRep?.fullName || '_______________'}
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

        <Text style={[styles.paragraph, { marginTop: 15, fontFamily: 'Roboto-Bold' }]}>
          Pełnomocnictwo NIE obejmuje odbioru środków z dofinansowania — środki wypłacane
          są bezpośrednio na rachunek bankowy Mocodawcy.
        </Text>

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

        <Text style={styles.footer}>{FOOTER}</Text>
      </Page>
    </Document>
  );
}
