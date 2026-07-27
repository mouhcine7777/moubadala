import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { CGU_CONTRACT_ARTICLES } from './contractCguTemplate'
import { computeServiceTotalTtc, sumPartyTotal } from '@/lib/contract-utils'
import type { Contract, ContractService, ContractMilestone, ContractDocument } from '@/lib/types'

const EXCHANGE_TYPE_LABELS: Record<string, string> = {
  produit_produit: 'Produit ↔ Produit',
  service_service: 'Service ↔ Service',
  produit_service: 'Produit ↔ Service',
  plusieurs: 'Échange mixte',
  autre: 'Autre',
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  h1: { fontSize: 16, fontWeight: 700, color: '#0D3B66', marginBottom: 4 },
  h2: { fontSize: 12, fontWeight: 700, color: '#0D3B66', marginTop: 16, marginBottom: 8, borderBottom: '1pt solid #0D3B66', paddingBottom: 3 },
  h3: { fontSize: 10, fontWeight: 700, marginTop: 8, marginBottom: 3 },
  small: { fontSize: 8, color: '#666' },
  paragraph: { marginBottom: 6, lineHeight: 1.5 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  table: { marginTop: 4, marginBottom: 6 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #ddd', paddingVertical: 4 },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#EEF3F8', paddingVertical: 4 },
  tableCell: { flex: 1, fontSize: 9 },
  badge: { fontSize: 8, color: '#0D3B66', backgroundColor: '#EEF3F8', padding: 4, borderRadius: 3, marginBottom: 2 },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, fontSize: 7, color: '#999', textAlign: 'center' },
})

function PartyBlock({ label, profile, signatory }: { label: string; profile: any; signatory: any }) {
  return (
    <View style={styles.col}>
      <Text style={styles.h3}>{label}</Text>
      <Text>{profile?.company_name ?? '—'}</Text>
      <Text style={styles.small}>Forme juridique : {profile?.legal_form ?? '—'}</Text>
      <Text style={styles.small}>ICE : {profile?.ice ?? '—'} · RC : {profile?.rc ?? '—'} · IF : {profile?.if_number ?? '—'}</Text>
      <Text style={styles.small}>Adresse : {profile?.address ?? '—'}, {profile?.city ?? ''}</Text>
      <Text style={styles.small}>Représentée par : {signatory?.prenom} {signatory?.nom} ({signatory?.fonction})</Text>
      <Text style={styles.small}>Email : {signatory?.email ?? profile?.email ?? '—'}</Text>
    </View>
  )
}

function ServicesTable({ services }: { services: ContractService[] }) {
  if (services.length === 0) return <Text style={styles.small}>Aucune prestation renseignée.</Text>
  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={styles.tableCell}>Désignation</Text>
        <Text style={styles.tableCell}>Description</Text>
        <Text style={styles.tableCell}>Quantité</Text>
        <Text style={styles.tableCell}>Valeur TTC</Text>
        <Text style={styles.tableCell}>Délai</Text>
      </View>
      {services.map(s => (
        <View key={s.id} style={styles.tableRow}>
          <Text style={styles.tableCell}>{s.label}</Text>
          <Text style={styles.tableCell}>{s.description}</Text>
          <Text style={styles.tableCell}>{s.quantite ? `${s.quantite} ${s.unite ?? ''}` : '—'}</Text>
          <Text style={styles.tableCell}>{computeServiceTotalTtc(s).toLocaleString()} MAD</Text>
          <Text style={styles.tableCell}>{s.delai_fin ?? '—'}</Text>
        </View>
      ))}
    </View>
  )
}

function ContractPdfDocument({
  contract, services, milestones, documents,
}: {
  contract: Contract & { party_a: any; party_b: any }
  services: ContractService[]
  milestones: ContractMilestone[]
  documents: ContractDocument[]
}) {
  const servicesA = services.filter(s => s.party === 'a')
  const servicesB = services.filter(s => s.party === 'b')
  const totalA = sumPartyTotal(services, 'a')
  const totalB = sumPartyTotal(services, 'b')

  return (
    <Document title={`Contrat ${contract.contract_number}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Fiche Contractuelle d'Échange</Text>
        <Text style={styles.small}>N° {contract.contract_number} — Moubadala</Text>

        <Text style={styles.h2}>Conditions Contractuelles Générales</Text>
        {CGU_CONTRACT_ARTICLES.map(article => (
          <View key={article.title} wrap={false}>
            <Text style={styles.h3}>{article.title}</Text>
            {article.body.map((p, i) => <Text key={i} style={styles.paragraph}>{p}</Text>)}
          </View>
        ))}

        <Text style={styles.h2}>Chapitre I — Les Parties Contractantes</Text>
        <View style={styles.row}>
          <PartyBlock
            label="Entreprise A" profile={contract.party_a}
            signatory={{ nom: contract.signatory_a_nom, prenom: contract.signatory_a_prenom, fonction: contract.signatory_a_fonction, email: contract.signatory_a_email }}
          />
          <PartyBlock
            label="Entreprise B" profile={contract.party_b}
            signatory={{ nom: contract.signatory_b_nom, prenom: contract.signatory_b_prenom, fonction: contract.signatory_b_fonction, email: contract.signatory_b_email }}
          />
        </View>

        <Text style={styles.h2}>Chapitre II — Objet du Contrat</Text>
        <Text style={styles.paragraph}>
          Le présent contrat a pour objet de définir les conditions particulières de l'échange conclu entre les Parties, tel que décrit ci-après.
        </Text>
        <Text><Text style={styles.h3}>Nature de l'échange : </Text>{EXCHANGE_TYPE_LABELS[contract.exchange_type ?? ''] ?? '—'}</Text>
        <Text><Text style={styles.h3}>Intitulé : </Text>{contract.title ?? '—'}</Text>
        <Text style={styles.paragraph}>{contract.description ?? '—'}</Text>
        {contract.confidentialite === 'renforcee' && (
          <Text style={styles.paragraph}>
            Clause de confidentialité renforcée : les Parties s'engagent à une confidentialité stricte sur l'ensemble des informations échangées dans le cadre du présent Contrat.
          </Text>
        )}

        <Text style={styles.h2}>Chapitre III — Prestations des Parties</Text>
        <Text style={styles.h3}>3.1 Prestations de l'Entreprise A</Text>
        <ServicesTable services={servicesA} />
        <Text style={styles.paragraph}>Valeur totale des prestations de l'Entreprise A : {totalA.toLocaleString()} MAD</Text>
        <Text style={styles.h3}>3.2 Prestations de l'Entreprise B</Text>
        <ServicesTable services={servicesB} />
        <Text style={styles.paragraph}>Valeur totale des prestations de l'Entreprise B : {totalB.toLocaleString()} MAD</Text>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages} — Contrat ${contract.contract_number}`} fixed />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>Chapitre IV — Conditions financières de l'échange</Text>
        <Text style={styles.paragraph}>
          Article 4.1 — Les Parties reconnaissent avoir librement déterminé la valeur des prestations qu'elles s'engagent à échanger.
        </Text>
        <View style={styles.row}>
          <Text style={styles.col}>Entreprise A : {totalA.toLocaleString()} MAD</Text>
          <Text style={styles.col}>Entreprise B : {totalB.toLocaleString()} MAD</Text>
        </View>
        <Text style={styles.paragraph}>
          Article 4.2 — {contract.compensation_prevue ? 'Une compensation financière est prévue.' : 'Les prestations sont considérées comme équilibrées.'}
        </Text>
        {contract.compensation_prevue && (
          <Text style={styles.paragraph}>
            Article 4.3 — Compensation : {contract.compensation_montant?.toLocaleString()} {contract.compensation_devise}, mode de règlement : {contract.compensation_mode ?? '—'}, échéance : {contract.compensation_echeance ?? '—'}.
          </Text>
        )}

        <Text style={styles.h2}>Chapitre V — Calendrier d'exécution</Text>
        <Text>Début de l'échange : {contract.calendar_start_date ?? '—'}</Text>
        <Text>Date limite : {contract.calendar_end_date ?? '—'}</Text>
        {milestones.length > 0 && (
          <View style={styles.table}>
            {milestones.map(m => (
              <View key={m.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{m.label}</Text>
                <Text style={styles.tableCell}>{m.due_date}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.h2}>Chapitre VI — Documents contractuels et annexes</Text>
        {documents.length === 0
          ? <Text style={styles.small}>Aucune annexe jointe.</Text>
          : (
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.tableCell}>N°</Text>
                <Text style={styles.tableCell}>Désignation</Text>
                <Text style={styles.tableCell}>Version</Text>
              </View>
              {documents.map((d, i) => (
                <View key={d.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>A{i + 1}</Text>
                  <Text style={styles.tableCell}>{d.title}</Text>
                  <Text style={styles.tableCell}>V{d.version}</Text>
                </View>
              ))}
            </View>
          )}

        <Text style={styles.h2}>Chapitre VII — Validation et signature électronique</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.h3}>Entreprise A</Text>
            <Text style={styles.small}>{contract.signatory_a_prenom} {contract.signatory_a_nom} ({contract.signatory_a_fonction})</Text>
            <Text style={styles.small}>Signé le : {contract.signed_at_a ? new Date(contract.signed_at_a).toLocaleString('fr-FR') : '—'}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.h3}>Entreprise B</Text>
            <Text style={styles.small}>{contract.signatory_b_prenom} {contract.signatory_b_nom} ({contract.signatory_b_fonction})</Text>
            <Text style={styles.small}>Signé le : {contract.signed_at_b ? new Date(contract.signed_at_b).toLocaleString('fr-FR') : '—'}</Text>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages} — Contrat ${contract.contract_number}`} fixed />
      </Page>
    </Document>
  )
}

export async function renderContractPdfBuffer(
  contract: any, services: ContractService[], milestones: ContractMilestone[], documents: ContractDocument[]
): Promise<Buffer> {
  return renderToBuffer(
    <ContractPdfDocument contract={contract} services={services} milestones={milestones} documents={documents} />
  )
}
