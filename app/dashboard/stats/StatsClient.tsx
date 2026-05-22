'use client'
import {
  FileText, Eye, TrendingUp, ArrowLeftRight,
  MessageCircle, CheckCircle, Award
} from 'lucide-react'

type Stats = {
  listings: {
    total: number
    published: number
    totalViews: number
    totalValueOffered: number
  }
  requests: {
    received: number
    sent: number
    acceptedRate: number
    accepted: number
  }
  transactions: {
    total: number
    closed: number
    totalValue: number
  }
  messages: {
    sent: number
  }
  chart: {
    label: string
    listings: number
    requests: number
  }[]
}

function StatCard({
  icon, label, value, sub, color = 'text-[#0D3B66]', bg = 'bg-white',
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  color?: string
  bg?: string
}) {
  return (
    <div className={`${bg} rounded-xl border border-gray-100 shadow-sm p-7 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-full bg-[#EEF3F8] flex items-center justify-center text-[#0D3B66]">
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
        <p className="text-sm text-black mt-1">{label}</p>
        {sub && <p className="text-sm text-black mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function StatsClient({ stats }: { stats: Stats }) {
  const maxAll = Math.max(
    ...stats.chart.map(m => m.listings),
    ...stats.chart.map(m => m.requests),
    1
  )

  return (
    <div className="flex flex-col gap-8">

      {/* KPIs principaux */}
      <div>
        <h2 className="text-base font-bold text-[#0D3B66] uppercase tracking-wide mb-5">
          Vue d'ensemble
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Eye size={20}/>}
            label="Vues totales"
            value={stats.listings.totalViews.toLocaleString()}
            sub="sur toutes vos annonces"
          />
          <StatCard
            icon={<FileText size={20}/>}
            label="Annonces publiées"
            value={stats.listings.published}
            sub={`${stats.listings.total} au total`}
          />
          <StatCard
            icon={<TrendingUp size={20}/>}
            label="Taux de concrétisation"
            value={`${stats.requests.acceptedRate}%`}
            sub={`${stats.requests.accepted} / ${stats.requests.received} demandes`}
            color={stats.requests.acceptedRate >= 50 ? 'text-green-600' : 'text-amber-600'}
            bg={stats.requests.acceptedRate >= 50 ? 'bg-green-50' : 'bg-amber-50'}
          />
          <StatCard
            icon={<Award size={20}/>}
            label="Valeur totale échangée"
            value={`${stats.transactions.totalValue.toLocaleString()} MAD`}
            sub={`${stats.transactions.closed} transaction(s) clôturée(s)`}
            color="text-[#F5A623]"
          />
        </div>
      </div>

      {/* Graphique activité 6 mois */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#0D3B66]">Activité des 6 derniers mois</h2>
          <div className="flex items-center gap-4 text-sm text-black">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#0D3B66] inline-block"/>Annonces
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F5A623] inline-block"/>Demandes reçues
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {stats.chart.map((month, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex gap-1 items-end h-20">
                <div className="flex-1 flex items-end">
                  <div
                    className="w-full bg-[#0D3B66] rounded-t-sm transition-all"
                    style={{ height: maxAll > 0 ? `${Math.max((month.listings / maxAll) * 100, month.listings > 0 ? 8 : 0)}%` : '0%' }}
                  />
                </div>
                <div className="flex-1 flex items-end">
                  <div
                    className="w-full bg-[#F5A623] rounded-t-sm transition-all"
                    style={{ height: maxAll > 0 ? `${Math.max((month.requests / maxAll) * 100, month.requests > 0 ? 8 : 0)}%` : '0%' }}
                  />
                </div>
              </div>
              <p className="text-xs text-black text-center">{month.label}</p>
              <p className="text-xs text-black text-center">{month.listings + month.requests}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Détail par section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Annonces */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-[#0D3B66] flex items-center gap-2">
            <FileText size={17}/> Annonces
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Total créées',          value: stats.listings.total                                              },
              { label: 'Actuellement publiées', value: stats.listings.published                                          },
              { label: 'Vues cumulées',          value: stats.listings.totalViews.toLocaleString()                      },
              { label: 'Valeur totale offerte',  value: `${stats.listings.totalValueOffered.toLocaleString()} MAD`      },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                <p className="text-sm text-black">{item.label}</p>
                <p className="text-sm font-bold text-[#0D3B66]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demandes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-[#0D3B66] flex items-center gap-2">
            <ArrowLeftRight size={17}/> Demandes
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Reçues',              value: stats.requests.received            },
              { label: 'Envoyées',            value: stats.requests.sent                },
              { label: 'Acceptées',           value: stats.requests.accepted            },
              { label: 'Taux concrétisation', value: `${stats.requests.acceptedRate}%`  },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                <p className="text-sm text-black">{item.label}</p>
                <p className="text-sm font-bold text-[#0D3B66]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  stats.requests.acceptedRate >= 50 ? 'bg-green-400' : 'bg-amber-400'
                }`}
                style={{ width: `${stats.requests.acceptedRate}%` }}
              />
            </div>
            <p className="text-sm text-black text-right">
              {stats.requests.acceptedRate}% de concrétisation
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-[#0D3B66] flex items-center gap-2">
            <CheckCircle size={17}/> Transactions
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Total transactions', value: stats.transactions.total                                },
              { label: 'Clôturées',          value: stats.transactions.closed                               },
              { label: 'En cours',           value: stats.transactions.total - stats.transactions.closed    },
              { label: 'Valeur totale',      value: `${stats.transactions.totalValue.toLocaleString()} MAD` },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                <p className="text-sm text-black">{item.label}</p>
                <p className="text-sm font-bold text-[#0D3B66]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#F5A623]">
              {stats.transactions.totalValue.toLocaleString()} MAD
            </p>
            <p className="text-sm text-black mt-1">valeur totale échangée</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#EEF3F8] flex items-center justify-center">
          <MessageCircle size={22} className="text-[#0D3B66]"/>
        </div>
        <div>
          <p className="text-base font-bold text-[#0D3B66]">
            {stats.messages.sent} message{stats.messages.sent !== 1 ? 's' : ''} envoyé{stats.messages.sent !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-black">Total de vos échanges sur la messagerie</p>
        </div>
      </div>

    </div>
  )
}