import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { computeServiceTotalTtc } from '@/lib/contract-utils'
import type { Contract, ContractService, ContractReserve } from '@/lib/types'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  h1: { fontSize: 16, fontWeight: 700, color: '#0D3B66', marginBottom: 4 },
  h2: { fontSize: 12, fontWeight: 700, color: '#0D3B66', marginTop: 16, marginBottom: 8, borderBottom: '1pt solid #0D3B66', paddingBottom: 3 },
  small: { fontSize: 8, color: '#666' },
  paragraph: { marginBottom: 6, lineHeight: 1.5 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #ddd', paddingVertical: 4 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#EEF3F8', paddingVertical: 4 },
  tableCell: { flex: 1, fontSize: 9 },
})

function ClosurePvDocument({
  contract, services, reserves,
}: {
  contract: Contract & { party_a: any; party_b: any }
  services: ContractService[]
  reserves: ContractReserve[]
}) {
  const unresolvedReserves = reserves.filter(r => r.status === 'ouverte')

  return (
    <Document title={`PV de clôture ${contract.contract_number}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Procès-Verbal de Clôture de l'Échange</Text>
        <Text style={styles.small}>Contrat N° {contract.contract_number} — Moubadala</Text>

        <Text style={styles.h2}>Parties</Text>
        <Text>Entreprise A : {contract.party_a?.company_name ?? '—'}</Text>
        <Text>Entreprise B : {contract.party_b?.company_name ?? '—'}</Text>

        <Text style={styles.h2}>Prestations exécutées</Text>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableCell}>Désignation</Text>
          <Text style={styles.tableCell}>Entreprise</Text>
          <Text style={styles.tableCell}>Valeur</Text>
          <Text style={styles.tableCell}>Statut final</Text>
        </View>
        {services.map(s => (
          <View key={s.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{s.label} — {s.description}</Text>
            <Text style={styles.tableCell}>{s.party === 'a' ? 'Entreprise A' : 'Entreprise B'}</Text>
            <Text style={styles.tableCell}>{computeServiceTotalTtc(s).toLocaleString()} MAD</Text>
            <Text style={styles.tableCell}>{s.exec_status}</Text>
          </View>
        ))}

        <Text style={styles.h2}>Date de clôture</Text>
        <Text>{new Date().toLocaleDateString('fr-FR')}</Text>

        <Text style={styles.h2}>Déclaration commune</Text>
        {unresolvedReserves.length === 0 ? (
          <Text style={styles.paragraph}>
            Les Parties attestent conjointement de la bonne exécution de l'ensemble des prestations prévues au Contrat susvisé.
          </Text>
        ) : (
          <View>
            <Text style={styles.paragraph}>
              Les Parties clôturent l'échange en maintenant les réserves suivantes :
            </Text>
            {unresolvedReserves.map(r => (
              <Text key={r.id} style={styles.paragraph}>— {r.subject} : {r.description}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

export async function renderClosurePvBuffer(
  contract: any, services: ContractService[], reserves: ContractReserve[]
): Promise<Buffer> {
  return renderToBuffer(<ClosurePvDocument contract={contract} services={services} reserves={reserves} />)
}
