# Server Deployment Guide

## Environment Variables for Vercel

Make sure to set these environment variables in your Vercel dashboard:

```env
# Database Configuration
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-url"

# JWT Configuration
JWT_SECRET="your-jwt-secret"

# PayPal Configuration
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-app-password"

# Node Environment
NODE_ENV="production"
```

## Deployment Steps

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `server` folder as the root directory

3. **Configure Build Settings:**
   - Framework Preset: Other
   - Root Directory: `server`
   - Build Command: `yarn build`
   - Output Directory: `.` (leave as default)
   - Install Command: `yarn install`

4. **Set Environment Variables:**
   - Add all the environment variables listed above in Vercel dashboard

5. **Deploy:**
   - Click Deploy
   - Vercel will automatically run the build and deployment

## Important Notes

- The server is configured for serverless deployment on Vercel
- Prisma will generate the client during the build process
- Database migrations should be run separately if needed
- CORS is configured to allow your frontend domains

## Testing the Deployment

After deployment, test these endpoints:
- `https://your-vercel-domain.vercel.app/api/user/count`
- `https://your-vercel-domain.vercel.app/api/listing/listings`

## Troubleshooting

- Check Vercel function logs if deployment fails
- Ensure all environment variables are set correctly
- Verify database connection URL is accessible from Vercel
- Check that Prisma schema is compatible with your database