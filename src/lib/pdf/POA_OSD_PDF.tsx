import React from 'react';
import { Document, Page, Text, View, Font, Image } from '@react-pdf/renderer';
import { ContractData } from '@/types/contract';
import { getOSDName } from '@/lib/contract-helpers';
import { styles } from './styles';
import { robotoRegularBase64 } from '@/lib/fonts/roboto-regular';
import { robotoBoldBase64 } from '@/lib/fonts/roboto-bold';
import { logoWhiteBase64 } from '@/lib/fonts/logo-white-base64';

Font.register({ family: 'Roboto', src: `data:font/truetype;base64,${robotoRegularBase64}` });
Font.register({ family: 'Roboto-Bold', src: `data:font/truetype;base64,${robotoBoldBase64}` });

const FOOTER = 'Nexbe sp. z o.o. | ul. Stefana Batorego 18/108, 02-591 Warszawa | nexbe.pl | kontakt@nexbe.pl | +48 732 080 101';

export function POA_OSD_PDF({ data }: { data: ContractData }) {
  const d = data;
  const osdName = d.existingPV?.osd ? getOSDName(d.existingPV.osd) : '_______________';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={`data:image/png;base64,${logoWhiteBase64}`} style={{ width: 90, height: 28 }} />
          <View style={styles.headerRight}>
            <Text>Załącznik nr 2 do Umowy {d.contractNumber}</Text>
          </View>
        </View>

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
          reprezentowanej przez: {d.salesRep?.fullName || '_______________'}
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

        <Text style={styles.footer}>{FOOTER}</Text>
      </Page>
    </Document>
  );
}
