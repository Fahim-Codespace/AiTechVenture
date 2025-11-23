# Setup Guide for AiTechVenture

## Google Sheets API Setup

To enable newsletter subscriptions to save to Google Sheets, follow these steps:

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

### Step 3: Create a Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the service account details:
   - Name: `aitechventure-sheets` (or any name you prefer)
   - Click **Create and Continue**
   - Skip the optional steps and click **Done**

### Step 4: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the JSON file (keep it secure, don't commit it to git!)

### Step 5: Extract Credentials from JSON

Open the downloaded JSON file. You'll need:
- `client_email` - This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` - This is your `GOOGLE_PRIVATE_KEY`

### Step 6: Create a Google Sheet

1. Create a new Google Sheet
2. Add headers in the first row:
   - Column A: `Name`
   - Column B: `Email`
   - Column C: `Timestamp`
3. Copy the Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

### Step 7: Share Sheet with Service Account

1. In your Google Sheet, click **Share**
2. Add the service account email (the `client_email` from Step 5)
3. Give it **Editor** permissions
4. Click **Send** (you can uncheck "Notify people")

### Step 8: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
GOOGLE_SHEETS_ID=your_sheet_id_from_step_6
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_client_email_from_step_5
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from step 5\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The `GOOGLE_PRIVATE_KEY` should include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Use `\n` for line breaks in the private key
- Keep the quotes around the private key value
- Never commit `.env.local` to git (it's already in `.gitignore`)

### Step 9: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/newsletter`
3. Fill out the form and submit
4. Check your Google Sheet - you should see the new entry!

## Troubleshooting

### Error: "Missing Google Sheets configuration"
- Make sure all three environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### Error: "The caller does not have permission"
- Make sure you shared the Google Sheet with the service account email
- Verify the service account has Editor permissions

### Error: "Unable to parse range"
- Check that your sheet has the correct structure (Name, Email, Timestamp columns)
- Verify the `GOOGLE_SHEETS_ID` is correct

### Private Key Issues
- Make sure the private key includes the BEGIN and END lines
- Ensure line breaks are represented as `\n`
- Keep the quotes around the entire private key value

## Security Best Practices

1. **Never commit credentials to git** - `.env.local` is already in `.gitignore`
2. **Use environment variables** - Never hardcode credentials in your code
3. **Limit service account permissions** - Only give it access to the specific sheet it needs
4. **Rotate keys periodically** - Create new service account keys if you suspect a breach

