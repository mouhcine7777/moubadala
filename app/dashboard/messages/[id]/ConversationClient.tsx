'use client'
import { useState, useRef, useLayoutEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markConversationAsRead } from '@/lib/actions/messages'
import { supabase } from '@/lib/supabase'
import { Send, ArrowLeftRight, Paperclip, X, FileText, Download } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import clsx from 'clsx'
import Link from 'next/link'

const EXCHANGE_LABEL: Record<string, string> = {
  service_service: 'Service ↔ Service',
  product_service: 'Produit ↔ Service',
  product_product: 'Produit ↔ Produit',
}

const STATUS_COLOR: Record<string, string> = {
  accepted:   'bg-green-100 text-green-800',
  finalizing: 'bg-purple-100 text-purple-800',
}

const STATUS_LABEL: Record<string, string> = {
  accepted:   'Acceptée',
  finalizing: 'En finalisation',
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase()
  const colors: Record<string, string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    docx: 'text-blue-500',
    xls: 'text-green-500',
    xlsx: 'text-green-500',
  }
  return <FileText size={14} className={colors[ext ?? ''] ?? 'text-gray-400'} />
}

export default function ConversationClient({
  conversation,
  currentUserId,
}: {
  conversation: any
  currentUserId: string
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const messages = [...(conversation.messages ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const partner = currentUserId === conversation.sender_clerk_id
    ? conversation.receiver
    : conversation.sender

  const listing = conversation.listings

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (container) container.scrollTop = container.scrollHeight
  })

  useLayoutEffect(() => {
    markConversationAsRead(conversation.id, currentUserId)
  }, [conversation.id, currentUserId])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFileError('')
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError('Format non supporté. Utilisez PDF, Word, Excel ou image.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError('Fichier trop volumineux (max 10 Mo).')
      return
    }
    setFile(f)
  }

  async function uploadFile(f: File): Promise<{ url: string; name: string; size: number }> {
    const ext = f.name.split('.').pop()
    const path = `messages/${conversation.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('listings-images').upload(path, f)
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('listings-images').getPublicUrl(path)
    return { url: data.publicUrl, name: f.name, size: f.size }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() && !file) return
    setSending(true)
    try {
      let attachment: { url: string; name: string; size: number } | undefined
      if (file) {
        setUploadProgress(true)
        attachment = await uploadFile(file)
        setUploadProgress(false)
      }
      await sendMessage(
        conversation.id,
        currentUserId,
        content.trim() || (attachment ? `📎 ${attachment.name}` : ''),
        attachment
      )
      setContent('')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      startTransition(() => router.refresh())
    } catch (err) {
      console.error(err)
    }
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if ((content.trim() || file) && !sending) handleSend(e as any)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Carte annonce */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLOR[conversation.status])}>
              {STATUS_LABEL[conversation.status]}
            </span>
          </div>
          {listing && (
            <Link
              href={`/moubaplace/${listing.id}`}
              target="_blank"
              className="text-sm font-bold text-[#0D3B66] hover:underline"
            >
              {listing.title}
            </Link>
          )}
          {listing?.exchange_type && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <ArrowLeftRight size={10} />{EXCHANGE_LABEL[listing.exchange_type]}
              {listing.value_mad && ` · ${listing.value_mad.toLocaleString()} MAD`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-white font-bold text-xs">
            {partner?.company_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-[#0D3B66]">{partner?.company_name}</p>
            <p className="text-xs text-gray-400">{partner?.sector}</p>
          </div>
        </div>
      </div>

      {/* Zone messages */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        <div
          ref={scrollRef}
          className="p-5 flex flex-col gap-3 overflow-y-auto"
          style={{ height: '460px' }}
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <p className="text-gray-300 text-sm">Commencez la conversation...</p>
            </div>
          ) : (
            <>
              {messages.map((msg: any) => {
                const isMe = msg.sender_clerk_id === currentUserId
                return (
                  <div
                    key={msg.id}
                    className={clsx('flex flex-col gap-1', isMe ? 'items-end' : 'items-start')}
                  >

{msg.attachment_url && (
  <Link
    href={msg.attachment_url}
    target="_blank"
    rel="noopener noreferrer"
    className={clsx(
      'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-colors max-w-xs',
      isMe
        ? 'bg-[#0D3B66]/10 border-[#0D3B66]/20 text-[#0D3B66] hover:bg-[#0D3B66]/20'
        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
    )}
  >
    <FileIcon name={msg.attachment_name ?? 'file'} />
    <span className="truncate max-w-[160px]">{msg.attachment_name}</span>
    {msg.attachment_size && (
      <span className="text-gray-400 shrink-0">{formatBytes(msg.attachment_size)}</span>
    )}
    <Download size={12} className="shrink-0 text-gray-400" />
  </Link>
)}

                    {/* Texte */}
                    {msg.content && !msg.content.startsWith('📎') && (
                      <div className={clsx(
                        'max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
                        isMe
                          ? 'bg-[#0D3B66] text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      )}>
                        {msg.content}
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 px-1">
                      {format(new Date(msg.created_at), 'dd MMM à HH:mm', { locale: fr })}
                    </p>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Aperçu fichier sélectionné */}
        {file && (
          <div className="mx-4 mb-2 flex items-center gap-2 bg-[#EEF3F8] border border-[#0D3B66]/10 rounded-lg px-3 py-2">
            <FileIcon name={file.name} />
            <span className="text-xs text-[#0D3B66] font-medium truncate flex-1">{file.name}</span>
            <span className="text-xs text-gray-400 shrink-0">{formatBytes(file.size)}</span>
            <button
              onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}
              className="text-gray-400 hover:text-red-500 transition-colors ml-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {fileError && (
          <p className="mx-4 mb-2 text-xs text-red-500">{fileError}</p>
        )}

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="border-t border-gray-100 p-4 flex items-end gap-2"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="p-2.5 text-gray-400 hover:text-[#0D3B66] border border-gray-200 hover:border-[#0D3B66]/30 rounded-xl transition-colors shrink-0"
            title="Joindre un fichier"
          >
            <Paperclip size={16} />
          </button>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={file ? 'Ajouter un message (optionnel)...' : 'Écrivez votre message... (Entrée pour envoyer)'}
            rows={2}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66]/20 focus:border-[#0D3B66] resize-none"
          />
          <button
            type="submit"
            disabled={sending || (!content.trim() && !file)}
            className="bg-[#0D3B66] hover:bg-[#0a2f52] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0"
          >
            {sending || uploadProgress
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
              : <Send size={16} />
            }
          </button>
        </form>

      </div>
    </div>
  )
}