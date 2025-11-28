# Deployment Guide

## ✅ Deployment Status

Your website has been successfully deployed to Vercel!

- **GitHub Repository**: https://github.com/Fahim-Codespace/AiTechVenture
- **Vercel Project**: aitechventure
- **Production URL**: https://aitechventure.vercel.app

## 🔧 Next Steps

### 1. Configure Environment Variables in Vercel

For the newsletter subscription to work, you need to add your Google Sheets credentials to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `aitechventure` project
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

```
GOOGLE_SHEETS_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
```

5. Make sure to add them for **Production**, **Preview**, and **Development** environments
6. After adding, redeploy the project (or wait for the next automatic deployment)

### 2. Verify Domain

The production domain `aitechventure.vercel.app` should be automatically available. If you want to use a custom domain:

1. Go to **Settings** > **Domains** in your Vercel project
2. Add your custom domain
3. Follow the DNS configuration instructions

### 3. Test Newsletter Subscription

1. Visit https://aitechventure.vercel.app/newsletter
2. Fill out the subscription form
3. Check your Google Sheet to verify the data is being saved

## 🔄 Automatic Deployments

Since your GitHub repository is connected to Vercel, every push to the `main` branch will automatically trigger a new deployment.

## 📝 Notes

- The `.env.local` file is for local development only
- Environment variables in Vercel are secure and not exposed to the client
- Make sure your Google Sheet is shared with the service account email
- The production URL is: **https://aitechventure.vercel.app**

## 🐛 Troubleshooting

If the newsletter subscription isn't working:
1. Check that all environment variables are set in Vercel
2. Verify the Google Sheet is shared with the service account
3. Check Vercel deployment logs for any errors
4. Ensure the Google Sheets API is enabled in your Google Cloud project









