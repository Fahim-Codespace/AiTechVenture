import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format with stricter rules
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    // Trim and validate email
    const trimmedEmail = email.trim().toLowerCase()
    
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Check for junk/test email patterns
    const junkPatterns = [
      /^test@/i,
      /^admin@/i,
      /^noreply@/i,
      /@test\./i,
      /@example\./i,
      /@localhost/i,
      /\.test$/i,
      /^[a-z]+@[a-z]+$/i, // Simple pattern like "abc@def" without proper domain
    ]
    
    if (junkPatterns.some(pattern => pattern.test(trimmedEmail))) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }
    
    // Check domain structure
    const domain = trimmedEmail.split('@')[1]
    if (!domain || !domain.includes('.')) {
      return NextResponse.json(
        { error: 'Invalid email domain' },
        { status: 400 }
      )
    }
    
    // Check TLD is valid (at least 2 characters)
    const tld = domain.split('.').pop()
    if (!tld || tld.length < 2) {
      return NextResponse.json(
        { error: 'Invalid email domain' },
        { status: 400 }
      )
    }
    
    // Check email length
    if (trimmedEmail.length < 5 || trimmedEmail.length > 254) {
      return NextResponse.json(
        { error: 'Email address is too short or too long' },
        { status: 400 }
      )
    }

    // Get Google Sheets credentials from environment variables
    const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const GOOGLE_PRIVATE_KEY_RAW = process.env.GOOGLE_PRIVATE_KEY
    const GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY_RAW?.replace(/\\n/g, '\n')

    if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google Sheets configuration', {
        hasId: !!GOOGLE_SHEETS_ID,
        hasEmail: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasKey: !!GOOGLE_PRIVATE_KEY_RAW,
      })
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Use Google Sheets API to check for duplicates and append the data
    const { google } = await import('googleapis')

    try {
      const auth = new google.auth.JWT(
        GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        GOOGLE_PRIVATE_KEY,
        ['https://www.googleapis.com/auth/spreadsheets']
      )

      const sheets = google.sheets({ version: 'v4', auth })

      // First, check if this email is already subscribed (assuming column B holds the email)
      const existing = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: 'Sheet1!B:B',
      })

      const existingEmails = (existing.data.values || []).flat().map((v: string) => v.toLowerCase())

      if (existingEmails.includes(trimmedEmail)) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        )
      }

      // Append the new row to the sheet
      // Assuming the sheet has columns: Name, Email, Timestamp
      const timestamp = new Date().toISOString()
      const values = [[name.trim(), trimmedEmail, timestamp]]

      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: 'Sheet1!A:C', // Adjust the range based on your sheet structure
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: values,
        },
      })

      // After saving to Sheets, send a welcome email (best-effort, non-blocking on failure)
      const GMAIL_USER = process.env.GMAIL_USER
      const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

      if (GMAIL_USER && GMAIL_APP_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
          },
        })

        const firstName = name.trim().split(' ')[0] || 'there'

        const mailOptions = {
          from: `"AInTECH Weekly" <${GMAIL_USER}>`,
          to: trimmedEmail,
          subject: 'Welcome to AInTECH Weekly 🚀',
          text: `Hello ${firstName},

Welcome to AInTECH Weekly!

You’re now subscribed to our weekly newsletter where we break down AI breakthroughs, real-world use cases, and practical insights to keep you ahead in the world of AI and technology.

Stay tuned for your first issue soon.

— The AInTECH Venture Team`,
          html: `<p>Hello <strong>${firstName}</strong>,</p>
<p>Welcome to <strong>AInTECH Weekly</strong>!</p>
<p>You're now subscribed to our weekly newsletter where we share:</p>
<ul>
  <li>Key breakthroughs in AI and emerging tech</li>
  <li>Real-world applications and mini case studies</li>
  <li>Actionable insights you can apply to your own projects</li>
</ul>
<p>Stay tuned for your first issue soon.</p>
<p>— The <strong>AInTECH Venture</strong> Team</p>`,
        }

        transporter.sendMail(mailOptions).catch((emailError) => {
          console.error('Failed to send welcome email:', emailError)
        })
      } else {
        console.warn('Skipping welcome email: GMAIL_USER or GMAIL_APP_PASSWORD not configured')
      }
    } catch (sheetsError: any) {
      console.error('Google Sheets API error:', sheetsError?.response?.data || sheetsError)
      return NextResponse.json(
        { error: 'Failed to save subscription. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}

