# Deployment Guide

This guide will help you deploy the Snoozies NFT Dashboard to production.

## Prerequisites Checklist

Before deploying, make sure you have:

- [ ] All API keys configured (Mintify, Basescan, Alchemy, Twitter)
- [ ] Tested the app locally with `npm run dev`
- [ ] Verified all data loads correctly
- [ ] Checked responsive design on mobile

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is free for hobby projects.

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Snoozies NFT Dashboard"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/seizoons.git

# Push
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In the Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add each variable from your `.env` file:
   - `NEXT_PUBLIC_MINTIFY_API_KEY`
   - `NEXT_PUBLIC_BASE_RPC_URL`
   - `BASESCAN_API_KEY`
   - `ALCHEMY_API_KEY`
   - `TWITTER_BEARER_TOKEN`
   - `NEXT_PUBLIC_NFT_CONTRACT`
   - `NEXT_PUBLIC_CHAIN_ID`

3. For production deployment, also add:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
   ```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at `your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS settings as instructed
4. SSL certificate is automatically provisioned

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

Environment variables: Configure in Netlify dashboard under "Site settings" → "Environment variables"

### Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables in project settings
5. Deploy automatically on push

### Self-Hosted (VPS/AWS/DigitalOcean)

```bash
# On your server

# Clone the repo
git clone https://github.com/yourusername/seizoons.git
cd seizoons

# Install dependencies
npm install

# Create .env file with your API keys
nano .env

# Build
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "snoozies-dashboard" -- start

# Or run directly
npm start
```

Access on port 3000 by default. Use Nginx as reverse proxy for production.

## Post-Deployment Checklist

- [ ] Test all features on production URL
- [ ] Verify API calls are working
- [ ] Check error handling (disable API key temporarily to test)
- [ ] Test on mobile devices
- [ ] Verify Twitter lists are accessible
- [ ] Check load times and performance
- [ ] Set up analytics (optional)
- [ ] Configure custom domain (optional)

## Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel dashboard for free:
- Page views
- Performance metrics
- User demographics

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

### Regular Updates

```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit

# Fix if needed
npm audit fix
```

## Troubleshooting

### Build Fails

- Check Next.js version compatibility
- Verify all TypeScript types are correct
- Review build logs for specific errors

### API Rate Limits

- Consider implementing Redis caching
- Adjust `MAX_WALLETS_TO_ANALYZE` in constants
- Add rate limiting middleware

### Slow Performance

- Enable Vercel Edge caching
- Reduce API call frequency
- Implement incremental static regeneration (ISR)

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Open an issue in the repository

---

**Your dashboard should now be live and accessible to the world!** 🎉
