import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body?.name || '').trim()
    const email = String(body?.email || '').trim().toLowerCase()
    const subject = String(body?.subject || '').trim()
    const message = String(body?.message || '').trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 })
    }

    // Sender (Gmail SMTP) credentials
    const GMAIL_USER = process.env.GMAIL_USER
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
    const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || GMAIL_USER

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_RECEIVER) {
      return NextResponse.json(
        { error: 'Contact form is not configured on the server yet.' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })

    const safeSubject = subject ? `Contact: ${subject}` : 'Contact: Website message'

    await transporter.sendMail({
      from: `"AiTechVenture Website" <${GMAIL_USER}>`,
      to: CONTACT_RECEIVER,
      replyTo: email,
      subject: safeSubject,
      text: `New message from AiTechVenture contact form

Name: ${name}
Email: ${email}
Subject: ${subject || '(none)'}

Message:
${message}
`,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

