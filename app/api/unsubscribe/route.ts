import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    const trimmedEmail = email.trim().toLowerCase()
    
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get Google Sheets credentials from environment variables
    const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const GOOGLE_PRIVATE_KEY_RAW = process.env.GOOGLE_PRIVATE_KEY
    const GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY_RAW?.replace(/\\n/g, '\n')

    if (!GOOGLE_SHEETS_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing Google Sheets configuration')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const { google } = await import('googleapis')

    try {
      const auth = new google.auth.JWT(
        GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        GOOGLE_PRIVATE_KEY,
        ['https://www.googleapis.com/auth/spreadsheets']
      )

      const sheets = google.sheets({ version: 'v4', auth })

      // Get all data to find the email and its row
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: 'Sheet1!A:D',
      })

      const rows = response.data.values || []
      
      // Skip header row (row 0) and find the email
      let emailRowIndex = -1
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        if (row && row.length > 1 && row[1]?.toString().toLowerCase() === trimmedEmail) {
          emailRowIndex = i + 1 // +1 because Sheets API uses 1-based indexing
          break
        }
      }

      if (emailRowIndex === -1) {
        return NextResponse.json(
          { error: 'Email not found in our subscription list.' },
          { status: 404 }
        )
      }

      // Check current status
      const currentRow = rows[emailRowIndex - 1] // Convert back to 0-based for array access
      const currentStatus = currentRow[3]?.toString().toLowerCase() || ''

      if (currentStatus === 'unsubscribed') {
        return NextResponse.json(
          { error: 'This email is already unsubscribed.' },
          { status: 409 }
        )
      }

      // Update the status column (column D) to 'unsubscribed'
      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: `Sheet1!D${emailRowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['unsubscribed']],
        },
      })

      return NextResponse.json(
        { message: 'Successfully unsubscribed from newsletter!' },
        { status: 200 }
      )
    } catch (sheetsError: any) {
      console.error('Google Sheets API error:', sheetsError?.response?.data || sheetsError)
      const errorMessage = sheetsError?.response?.data?.error?.message || sheetsError?.message || 'Unknown error'
      console.error('Detailed error:', JSON.stringify(sheetsError?.response?.data || sheetsError, null, 2))
      return NextResponse.json(
        { error: `Failed to unsubscribe: ${errorMessage}. Please try again later.` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    )
  }
}





