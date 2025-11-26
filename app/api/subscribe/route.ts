import { NextRequest, NextResponse } from 'next/server'

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
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google Sheets configuration')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Use Google Sheets API to append the data
    const { google } = await import('googleapis')
    
    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    )

    const sheets = google.sheets({ version: 'v4', auth })

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

