# AiTechVenture

Exploring AI and Technologies - A modern, minimal website showcasing the latest in AI and technology.

## Features

- 🏠 **Home Page** - Beautiful landing page with hero section and feature highlights
- 📧 **Newsletter Page** - Subscribe to the weekly newsletter with Google Sheets integration
- 🤖 **Technologies Page** - Explore different AI and tech categories
- 📰 **News Page** - Latest news and updates in AI and technology
- 🎨 **Modern Design** - Minimal, cool, and eye-catchy vibe with gradient animations
- 📱 **Responsive** - Works perfectly on all devices

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling with custom animations
- **Google Sheets API** - Newsletter subscription storage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Cloud project with Sheets API enabled
- A Google Service Account with credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AiTechVenture
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
GOOGLE_SHEETS_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
```

### Google Sheets Setup

1. Create a Google Cloud Project
2. Enable the Google Sheets API
3. Create a Service Account and download the JSON key
4. Share your Google Sheet with the service account email (with Editor permissions)
5. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
6. Add the credentials to your `.env.local` file

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
AiTechVenture/
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts          # Newsletter subscription API
│   ├── newsletter/
│   │   └── page.tsx              # Newsletter subscription page
│   ├── tech/
│   │   └── page.tsx              # Technologies showcase page
│   ├── news/
│   │   └── page.tsx              # News and updates page
│   ├── layout.tsx                # Root layout with Navbar/Footer
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── Navbar.tsx                # Navigation component
│   ├── Footer.tsx                # Footer component
│   └── NewsletterForm.tsx       # Newsletter subscription form
├── public/                       # Static assets
└── package.json
```

## Newsletter Integration

The newsletter subscription form saves data directly to your Google Sheet. Make sure your sheet has columns for:
- Name (Column A)
- Email (Column B)
- Timestamp (Column C)

The API route automatically appends new subscriptions to the sheet, which your workflow can then use to send newsletters.

## Customization

- Update colors in `tailwind.config.ts`
- Modify content in page components
- Adjust Google Sheets range in `app/api/subscribe/route.ts` if your sheet structure differs

## License

MIT
