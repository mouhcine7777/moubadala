'use client'
import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Step1Parties from './steps/Step1Parties'
import Step2Objet from './steps/Step2Objet'
import Step3Services from './steps/Step3Services'
import Step5Compensation from './steps/Step5Compensation'
import Step6Calendrier from './steps/Step6Calendrier'
import Step7Documents from './steps/Step7Documents'
import Step8Signature from './steps/Step8Signature'

const STEPS = [
  { n: 1, label: 'Parties' },
  { n: 2, label: 'Objet' },
  { n: 3, label: 'Prestations A' },
  { n: 4, label: 'Prestations B' },
  { n: 5, label: 'Équilibre' },
  { n: 6, label: 'Calendrier' },
  { n: 7, label: 'Annexes' },
  { n: 8, label: 'Signature' },
]

export default function ContractWizard({
  contract, services, milestones, documents, currentUserId,
}: {
  contract: any
  services: any[]
  milestones: any[]
  documents: any[]
  currentUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [step, setStep] = useState(1)

  function refresh() {
    startTransition(() => router.refresh())
  }

  function goTo(n: number) {
    setStep(Math.min(8, Math.max(1, n)))
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  return (
    <div className="flex flex-col gap-6">
      {/* Indicateur d'étapes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <button
                onClick={() => goTo(s.n)}
                className={clsx(
                  'flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full transition-colors whitespace-nowrap',
                  step === s.n
                    ? 'bg-[#0D3B66] text-white'
                    : step > s.n
                      ? 'text-green-700 bg-green-50 hover:bg-green-100'
                      : 'text-black hover:bg-gray-50'
                )}
              >
                <span>{step > s.n ? <Check size={13} /> : s.n}</span>
                <span>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-200 mx-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <Step1Parties contract={contract} currentUserId={currentUserId} onSaved={refresh} onContinue={() => goTo(2)} />
      )}
      {step === 2 && (
        <Step2Objet contract={contract} currentUserId={currentUserId} onSaved={refresh} onContinue={() => goTo(3)} onBack={() => goTo(1)} />
      )}
      {step === 3 && (
        <Step3Services
          contract={contract} services={services.filter(s => s.party === 'a')} party="a"
          currentUserId={currentUserId} onSaved={refresh} onContinue={() => goTo(4)} onBack={() => goTo(2)}
        />
      )}
      {step === 4 && (
        <Step3Services
          contract={contract} services={services.filter(s => s.party === 'b')} party="b"
          currentUserId={currentUserId} onSaved={refresh} onContinue={() => goTo(5)} onBack={() => goTo(3)}
        />
      )}
      {step === 5 && (
        <Step5Compensation
          contract={contract} services={services} currentUserId={currentUserId}
          onSaved={refresh} onContinue={() => goTo(6)} onBack={() => goTo(4)}
        />
      )}
      {step === 6 && (
        <Step6Calendrier
          contract={contract} milestones={milestones} currentUserId={currentUserId}
          onSaved={refresh} onContinue={() => goTo(7)} onBack={() => goTo(5)}
        />
      )}
      {step === 7 && (
        <Step7Documents
          contract={contract} documents={documents} currentUserId={currentUserId}
          onSaved={refresh} onContinue={() => goTo(8)} onBack={() => goTo(6)}
        />
      )}
      {step === 8 && (
        <Step8Signature
          contract={contract} services={services} milestones={milestones} documents={documents}
          currentUserId={currentUserId} onSaved={refresh} onBack={() => goTo(7)}
        />
      )}
    </div>
  )
}
