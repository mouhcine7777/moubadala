'use client'
import { useState } from 'react'
import { sendRequest } from '@/lib/actions/requests'
import { HandshakeIcon } from 'lucide-react'

export default function InterestButton({
  listingId,
  receiverClerkId,
  senderClerkId,
}: {
  listingId: string
  receiverClerkId: string
  senderClerkId: string
}) {
  const [step, setStep]       = useState<'idle' | 'form' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSend() {
    setLoading(true)
    try {
      await sendRequest(listingId, senderClerkId, receiverClerkId, message || null)
      setStep('sent')
    } catch (e: any) {
      setErrorMsg(e.message)
      setStep('error')
    }
    setLoading(false)
  }

  if (step === 'sent') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm text-green-800 font-medium text-center">
        Demande envoyée — l'entreprise vous contactera prochainement.
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 text-center">
        {errorMsg}
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-sm font-bold text-[#0D3B66]">Envoyer une demande</p>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Présentez-vous et expliquez votre intérêt pour cet échange (optionnel)..."
          rows={4}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] resize-none w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </button>
          <button
            onClick={() => setStep('idle')}
            className="px-4 py-2.5 border border-gray-200 text-sm text-gray-500 rounded-lg hover:border-gray-300 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setStep('form')}
      className="w-full flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e09510] text-white font-semibold py-3 rounded-xl transition-colors"
    >
      <HandshakeIcon size={18}/>
      Je suis intéressé par cet échange
    </button>
  )
}