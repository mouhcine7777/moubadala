import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateAndStoreContractPdf } from '@/lib/pdf/generateAndStoreContractPdf'

export const runtime = 'nodejs'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })

  const { id } = await params

  try {
    const url = await generateAndStoreContractPdf(id, userId)
    return NextResponse.json({ url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
