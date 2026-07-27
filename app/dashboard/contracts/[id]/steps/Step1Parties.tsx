'use client'
import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Building2, Search, UserPlus, CheckCircle2, AlertTriangle, Mail, RotateCw } from 'lucide-react'
import {
  searchMembersForContract, attachExistingPartyB, updateSignatory,
} from '@/lib/actions/contracts'

const inputCls = "border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] bg-white w-full"

function CompanyCard({ profile, roleLabel, isOwner }: { profile: any; roleLabel: string; isOwner: boolean }) {
  const missing: string[] = []
  if (isOwner) {
    if (!profile?.ice) missing.push('ICE')
    if (!profile?.rc) missing.push('RC')
    if (!profile?.if_number) missing.push('IF')
    if (!profile?.rep_nom || !profile?.rep_prenom) missing.push('représentant légal')
  }

  return (
    <div className="bg-[#EEF3F8] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide">{roleLabel}</p>
        {missing.length === 0
          ? <CheckCircle2 size={17} className="text-green-600" />
          : <AlertTriangle size={17} className="text-amber-500" />}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold shrink-0">
          {profile?.company_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-[#0D3B66] truncate">{profile?.company_name ?? 'Entreprise'}</p>
          <p className="text-sm text-black truncate">{profile?.sector} {profile?.city ? `· ${profile.city}` : ''}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-black">
        <p><span className="text-gray-500">ICE :</span> {profile?.ice ?? '—'}</p>
        <p><span className="text-gray-500">RC :</span> {profile?.rc ?? '—'}</p>
        <p><span className="text-gray-500">IF :</span> {profile?.if_number ?? '—'}</p>
        <p><span className="text-gray-500">Forme :</span> {profile?.legal_form ?? '—'}</p>
      </div>
      {missing.length > 0 && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Informations manquantes : {missing.join(', ')}.{' '}
          <Link href="/dashboard/profil" className="underline font-semibold">Modifier mon profil</Link>
        </p>
      )}
    </div>
  )
}

export default function Step1Parties({
  contract, currentUserId, onSaved, onContinue,
}: {
  contract: any
  currentUserId: string
  onSaved: () => void
  onContinue: () => void
}) {
  const [, startTransition] = useTransition()
  const isA = contract.party_a_clerk_id === currentUserId
  const myProfile = isA ? contract.party_a : contract.party_b
  const partnerProfile = isA ? contract.party_b : contract.party_a
  const partyBAssigned = !!contract.party_b_clerk_id

  // ── Recherche Partie B (uniquement affichée à la Partie A tant que B n'est pas rattachée) ──
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteCompany, setInviteCompany] = useState('')
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const r = await searchMembersForContract(currentUserId, query)
        setResults(r)
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(t)
  }, [query, currentUserId])

  async function handleAttach(partyBClerkId: string) {
    setError('')
    try {
      await attachExistingPartyB(contract.id, currentUserId, partyBClerkId)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteSending(true)
    setError('')
    try {
      const res = await fetch('/api/contracts/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id, clerkUserId: currentUserId,
          email: inviteEmail, companyName: inviteCompany,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Erreur lors de l'envoi de l'invitation.")
      setInviteSent(true)
      startTransition(onSaved)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setInviteSending(false)
    }
  }

  // ── Signataire (la partie de l'utilisateur courant) ──
  const [sig, setSig] = useState({
    nom:      (isA ? contract.signatory_a_nom      : contract.signatory_b_nom)      ?? '',
    prenom:   (isA ? contract.signatory_a_prenom   : contract.signatory_b_prenom)   ?? myProfile?.rep_prenom ?? '',
    fonction: (isA ? contract.signatory_a_fonction : contract.signatory_b_fonction) ?? myProfile?.rep_fonction ?? '',
    email:    (isA ? contract.signatory_a_email    : contract.signatory_b_email)    ?? myProfile?.rep_email ?? myProfile?.email ?? '',
    phone:    (isA ? contract.signatory_a_phone    : contract.signatory_b_phone)    ?? myProfile?.rep_phone ?? myProfile?.phone ?? '',
  })
  const [savingSig, setSavingSig] = useState(false)

  async function handleSaveSignatory(e: React.FormEvent) {
    e.preventDefault()
    setSavingSig(true)
    setError('')
    try {
      await updateSignatory(contract.id, currentUserId, sig)
      onSaved()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSavingSig(false)
    }
  }

  const signatoryComplete = sig.nom && sig.prenom && sig.fonction && sig.email
  const canContinue = partyBAssigned && signatoryComplete

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-bold text-[#0D3B66]">Étape 1 — Identification des Parties</h2>
        <p className="text-sm text-black mt-1">
          Les informations de votre entreprise proviennent automatiquement de votre profil Moubadala.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyCard profile={myProfile} roleLabel={`Entreprise ${isA ? 'A' : 'B'} (vous)`} isOwner />

        {partyBAssigned ? (
          <CompanyCard profile={partnerProfile} roleLabel={`Entreprise ${isA ? 'B' : 'A'} (partenaire)`} isOwner={false} />
        ) : isA ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col gap-3">
            <p className="text-sm font-bold text-[#0D3B66] uppercase tracking-wide">Entreprise B (partenaire)</p>

            {contract.party_b_pending_email ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-black flex items-center gap-2">
                  <Mail size={14} className="text-amber-500 shrink-0" />
                  Invitation envoyée à <span className="font-semibold">{contract.party_b_pending_email}</span>, en attente d'inscription.
                </p>
                <button
                  onClick={handleInvite}
                  disabled={inviteSending}
                  className="self-start flex items-center gap-1.5 text-sm font-semibold text-[#0D3B66] bg-[#EEF3F8] hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
                >
                  <RotateCw size={13} /> Renvoyer un rappel
                </button>
              </div>
            ) : !showInvite ? (
              <>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Rechercher par raison sociale, ICE, ville, activité..."
                    className={inputCls + ' pl-9'}
                  />
                </div>
                {searching && <p className="text-sm text-black">Recherche...</p>}
                {results.length > 0 && (
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                    {results.map(m => (
                      <button
                        key={m.clerk_user_id}
                        onClick={() => handleAttach(m.clerk_user_id)}
                        className="text-left px-3 py-2 rounded-lg border border-gray-100 hover:border-[#0D3B66]/30 hover:bg-[#EEF3F8] transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="min-w-0">
                          <span className="text-sm font-semibold text-[#0D3B66] block truncate">{m.company_name}</span>
                          <span className="text-sm text-black">{m.sector} {m.city ? `· ${m.city}` : ''}</span>
                        </span>
                        {m.status !== 'approved' && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                            compte non finalisé
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowInvite(true)}
                  className="self-start flex items-center gap-1.5 text-sm font-semibold text-black hover:text-[#0D3B66] mt-1"
                >
                  <UserPlus size={14} /> Cette entreprise n'est pas encore membre ?
                </button>
              </>
            ) : inviteSent ? (
              <p className="text-sm text-green-700">Invitation envoyée à {inviteEmail}.</p>
            ) : (
              <form onSubmit={handleInvite} className="flex flex-col gap-2.5">
                <input
                  type="email" required value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="Email de l'entreprise à inviter"
                  className={inputCls}
                />
                <input
                  value={inviteCompany}
                  onChange={e => setInviteCompany(e.target.value)}
                  placeholder="Nom de l'entreprise (facultatif)"
                  className={inputCls}
                />
                <div className="flex gap-2">
                  <button
                    type="submit" disabled={inviteSending}
                    className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                  >
                    {inviteSending ? 'Envoi...' : 'Envoyer l\'invitation'}
                  </button>
                  <button
                    type="button" onClick={() => setShowInvite(false)}
                    className="text-sm font-semibold text-black px-3 py-2"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-5 flex items-center justify-center">
            <p className="text-sm text-black text-center">En attente que l'Entreprise A renseigne son partenaire.</p>
          </div>
        )}
      </div>

      {/* Signataire */}
      <form onSubmit={handleSaveSignatory} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
        <p className="text-base font-bold text-[#0D3B66] flex items-center gap-2">
          <Building2 size={16} /> Signataire désigné pour votre entreprise
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <input required placeholder="Nom *" value={sig.nom} onChange={e => setSig(s => ({ ...s, nom: e.target.value }))} className={inputCls} />
          <input required placeholder="Prénom *" value={sig.prenom} onChange={e => setSig(s => ({ ...s, prenom: e.target.value }))} className={inputCls} />
          <input required placeholder="Fonction *" value={sig.fonction} onChange={e => setSig(s => ({ ...s, fonction: e.target.value }))} className={inputCls} />
          <input required type="email" placeholder="Email professionnel *" value={sig.email} onChange={e => setSig(s => ({ ...s, email: e.target.value }))} className={inputCls} />
          <input placeholder="Téléphone" value={sig.phone} onChange={e => setSig(s => ({ ...s, phone: e.target.value }))} className={inputCls} />
        </div>
        <button
          type="submit" disabled={savingSig}
          className="self-start text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] px-4 py-2.5 rounded-lg transition-colors disabled:opacity-40"
        >
          {savingSig ? 'Enregistrement...' : 'Enregistrer le signataire'}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          disabled={!canContinue}
          onClick={onContinue}
          className="text-sm font-semibold text-white bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-30 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg transition-colors"
        >
          Continuer →
        </button>
      </div>
    </div>
  )
}
