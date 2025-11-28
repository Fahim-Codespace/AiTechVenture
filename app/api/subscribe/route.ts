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

      // Get all data to check if email exists and its current status
      let emailRowIndex = -1
      let currentStatus = ''
      let isResubscription = false

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: 'Sheet1!A:D',
        })

        const rows = response.data.values || []
        
        // Skip header row (row 0) and find the email
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          if (row && row.length > 1 && row[1]?.toString().toLowerCase() === trimmedEmail) {
            emailRowIndex = i + 1 // +1 because Sheets API uses 1-based indexing
            currentStatus = row[3]?.toString().toLowerCase() || ''
            isResubscription = currentStatus === 'unsubscribed'
            break
          }
        }
      } catch (rangeError: any) {
        // If range doesn't exist or sheet is empty, that's okay - we'll just append
        console.log('Could not check for existing emails (sheet might be empty):', rangeError?.message)
      }

      const timestamp = new Date().toISOString()

      // If email exists and is already subscribed, return error
      if (emailRowIndex !== -1 && currentStatus === 'subscribed') {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        )
      }

      // If email exists but is unsubscribed, update the row (resubscription)
      if (isResubscription && emailRowIndex !== -1) {
        // Update name (column A), timestamp (column C), and status (column D)
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: GOOGLE_SHEETS_ID,
          requestBody: {
            valueInputOption: 'USER_ENTERED',
            data: [
              {
                range: `Sheet1!A${emailRowIndex}`,
                values: [[name.trim()]],
              },
              {
                range: `Sheet1!C${emailRowIndex}`,
                values: [[timestamp]],
              },
              {
                range: `Sheet1!D${emailRowIndex}`,
                values: [['subscribed']],
              },
            ],
          },
        })
      } else {
        // Email doesn't exist, append new row
        const values = [[name.trim(), trimmedEmail, timestamp, 'subscribed']]

        await sheets.spreadsheets.values.append({
          spreadsheetId: GOOGLE_SHEETS_ID,
          range: 'Sheet1!A1', // Start from A1, append will automatically find next empty row
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: values,
          },
        })
      }

      // After saving to Sheets, send a welcome email (best-effort, non-blocking on failure)
      const GMAIL_USER = process.env.GMAIL_USER
      const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

      if (GMAIL_USER && GMAIL_APP_PASSWORD) {
        console.log('Attempting to send welcome email', {
          hasUser: !!GMAIL_USER,
          hasPass: !!GMAIL_APP_PASSWORD,
        })

        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
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

You're now part of a community shaping the future of AI. Each issue features breakthroughs, real-world applications, detailed summaries, and direct citations to keep you informed.

See you in your inbox soon!

— The AiTechVenture Team`,
            html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to AInTECH Weekly</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px; }
    .container { max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08); }
    .header { background:#246BFE; padding:30px 20px; text-align:center; color:#fff; }
    .header h1 { margin:0; font-size:28px; font-weight:bold; }
    .header p { margin:10px 0 0; font-size:16px; opacity:0.95; }
    .content { padding:30px 40px; color:#333; }
    .content h2 { color:#246BFE; font-size:22px; margin:30px 0 15px; }
    .content p { font-size:16px; line-height:1.6; color:#444; margin:0 0 16px; }
    .content ul { padding-left:22px; margin:20px 0; }
    .content li { font-size:16px; line-height:1.6; margin-bottom:12px; color:#444; }
    .highlight-card {
      background:linear-gradient(135deg, #ffffff, #fefefe);
      border-left:6px solid #246BFE;
      padding:20px;
      border-radius:8px;
      margin:25px 0;
      box-shadow:0 2px 8px rgba(0,0,0,0.08);
      transition:all 0.3s;
    }
    .btn {
      display:inline-block;
      background:#246BFE;
      color:#fff;
      padding:12px 24px;
      border-radius:6px;
      text-decoration:none;
      font-weight:bold;
      font-size:15px;
      margin:20px 0;
      transition:all 0.3s;
    }
    .btn:hover { background:#1A5EDD; transform:translateY(-2px); }
    .footer { background:#f9f9f9; padding:25px 40px; text-align:center; font-size:13px; color:#666; border-top:1px solid #eee; }
    .footer a { color:#246BFE; text-decoration:none; }
    @media (max-width:640px) {
      .content, .footer { padding:20px !important; }
      .header h1 { font-size:24px !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AInTECH Weekly</h1>
      <p>Curated AI & tech insights — every Saturday</p>
    </div>

    <div class="content">
      <p>Hello <strong>${firstName}</strong>,</p>

      <p>You're now part of a new community of builders, researchers, and curious minds shaping the future of AI. Welcome to <strong>AInTECH Weekly!</strong></p>

      <div class="highlight-card">
        <h2>Here’s what lands in your inbox each week:</h2>
        <ul>
          <li>Latest breakthroughs in AI & emerging tech</li>
          <li>Real-world applications + mini case studies</li>
          <li>Detailed summeries with relevant images</li>
          <li>Direct citations and links to keep you informed.</li>
        </ul>
      </div>

      <p>Your first issue drops this Saturday. In the meantime, feel free to say hi or tell us what topics you’re most excited about — we actually read every reply.</p>

      <div style="text-align:center;">
        <a href="https://aitechventure.vercel.app" class="btn">Visit AiTechVenture →</a>
      </div>

      <p>See you in your inbox very soon!<br>
      — The <strong>AiTechVenture</strong> Team</p>
    </div>

    <div class="footer">
      <p>You’re subscribed to AInTECH Weekly • <a href="*|UNSUB|*">Unsubscribe</a> • <a href="https://aitechventure.vercel.app">AiTechVenture</a></p>
    </div>
  </div>
</body>
</html>`,
          }

          await transporter.sendMail(mailOptions)
          console.log('Welcome email sent successfully')
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError)
        }
      } else {
        console.warn('Skipping welcome email: GMAIL_USER or GMAIL_APP_PASSWORD not configured')
      }
    } catch (sheetsError: any) {
      console.error('Google Sheets API error:', sheetsError?.response?.data || sheetsError)
      const errorMessage = sheetsError?.response?.data?.error?.message || sheetsError?.message || 'Unknown error'
      console.error('Detailed error:', JSON.stringify(sheetsError?.response?.data || sheetsError, null, 2))
      return NextResponse.json(
        { error: `Failed to save subscription: ${errorMessage}. Please try again later.` },
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

