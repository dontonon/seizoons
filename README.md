# Snoozies NFT Dashboard

A beautiful, modern dashboard for the Snoozies NFT community built with Next.js 15.

![Dashboard Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✅ Current Status

**BUILD STATUS: ✅ PASSING**
- Local dev: ✅ Works
- Production build: ✅ Works
- Production server: ✅ Works
- Ready for deployment: ✅ Yes

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Test Production Build (Optional)
```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel (Recommended for Next.js)

Vercel is made by the creators of Next.js and provides the best deployment experience.

### Method 1: Deploy via GitHub (Easiest - Auto-deploys on push)

1. **Push your code to GitHub** (already done)

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"

3. **Import your repository**
   - Connect your GitHub account if needed
   - Select the `dontonon/seizoons` repository
   - Select branch: `claude/restart-seizoons-from-scratch-01LZKAoNCDMS88yxo3yhxGF2`

4. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Environment Variables** (Optional - for when you add APIs)
   ```
   NEXT_PUBLIC_NFT_CONTRACT=0x61a85534f124781231BaB486b111534D9653f19a
   NEXT_PUBLIC_CHAIN_ID=8453
   ```
   You can add more later when you connect real APIs.

6. **Click "Deploy"**
   - Build will take ~1-2 minutes
   - You'll get a live URL like `seizoons-xyz.vercel.app`

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 📊 What to Check in Vercel Dashboard

After deployment, check these sections in your Vercel dashboard:

### 1. **Deployments Tab**
   - ✅ Status should be "Ready"
   - ✅ Build Logs should show successful build
   - ✅ Preview URL should load your dashboard

### 2. **Build Logs** (if deployment fails)
   Look for:
   - ❌ TypeScript errors
   - ❌ Missing dependencies
   - ❌ Build command issues
   - ❌ Environment variable problems

### 3. **Runtime Logs** (if site loads but has errors)
   - Check for API errors
   - Check for missing environment variables
   - Check for runtime JavaScript errors

### 4. **Settings Tab**
   - **General**: Verify framework is set to "Next.js"
   - **Environment Variables**: Add any API keys here
   - **Domains**: Add custom domain (optional)

### 5. **Analytics** (Optional - Free tier available)
   - Enable Web Analytics to track visitors
   - View performance metrics

## 🔍 Common Vercel Issues & Solutions

### Issue: "Build Failed"
**Check:**
- Build logs in Vercel dashboard
- Does `npm run build` work locally?
- Are all dependencies in package.json?

**Solution:**
- Make sure your local build works first: `npm run build`
- Check Node.js version (should be 18+)

### Issue: "Site loads but shows errors"
**Check:**
- Runtime logs in Vercel dashboard
- Browser console for JavaScript errors

**Solution:**
- Test production build locally: `npm run build && npm start`
- Check for environment variable issues

### Issue: "Deployment is slow"
**Normal:** First deployment takes 2-3 minutes
**Subsequent deployments:** Usually 1-2 minutes

## 📁 Project Structure

```
seizoons/
├── app/
│   ├── globals.css      # Global styles + Tailwind
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main dashboard (client component)
├── .gitignore           # Git ignore (includes .vercel)
├── next.config.js       # Next.js config
├── package.json         # Dependencies
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Tech Stack

- **Next.js 15.5.6** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS
- **Vercel** - Deployment platform

## 🎯 Current Features

- ✅ Beautiful gradient UI (purple/slate theme)
- ✅ Responsive design (mobile-friendly)
- ✅ Hero stats cards with mock data
- ✅ Onchain analytics section
- ✅ Twitter metrics section
- ✅ Production-ready build
- ✅ Zero build errors
- ✅ Zero TypeScript errors

## 🔮 Roadmap - Next Steps

Phase 1 - Get Live:
- [x] Create working dashboard with mock data
- [x] Test build process
- [ ] Deploy to Vercel
- [ ] Verify live site works

Phase 2 - Add Real Data:
- [ ] Connect Mintify API for NFT holder data
- [ ] Integrate Alchemy for onchain analytics
- [ ] Add Twitter API integration
- [ ] Create interactive charts with Recharts

Phase 3 - Enhance:
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add data caching
- [ ] Add analytics tracking

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📝 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",           // Next.js framework
    "react": "^18.3.1",          // React library
    "react-dom": "^18.3.1",      // React DOM
    "recharts": "^2.10.0",       // Charts (for future use)
    "axios": "^1.6.0"            // HTTP client (for future API calls)
  },
  "devDependencies": {
    "@types/node": "^20",        // Node.js types
    "@types/react": "^18",       // React types
    "@types/react-dom": "^18",   // React DOM types
    "autoprefixer": "^10.0.1",   // PostCSS plugin
    "eslint": "^8",              // Linting
    "eslint-config-next": "^15", // Next.js ESLint config
    "postcss": "^8",             // CSS processor
    "tailwindcss": "^3.4.1",     // Tailwind CSS
    "typescript": "^5"           // TypeScript
  }
}
```

## 🤔 Troubleshooting

### Local Development Issues

**Port 3000 already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Build fails locally:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Vercel Deployment Issues

**Build fails on Vercel but works locally:**
1. Check Node.js version in Vercel settings (should be 18.x or 20.x)
2. Check build logs for specific errors
3. Ensure all environment variables are set correctly

**Site is live but shows errors:**
1. Check Runtime Logs in Vercel dashboard
2. Check browser console
3. Verify environment variables are set

## 📄 License

MIT License - Feel free to use for your own NFT communities!

## 🤝 Contributing

This is a private dashboard for the Snoozies community, but feel free to fork and adapt for your own projects!

---

**Built with ❤️ for the Snoozies Community**

**Questions?** Check the Vercel dashboard sections listed above for debugging.
