import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, company, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // TODO: send email / post to CRM
  // e.g. await sendEmail({ name, email, company, message })

  console.log('[contact form]', { name, email, company, message })

  return NextResponse.json({ ok: true })
}
