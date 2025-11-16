# Snoozies NFT Dashboard

A beautiful, modern dashboard for the Snoozies NFT community built with Next.js 15.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run locally**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Netlify

### Option 1: Netlify CLI (Fastest)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 2: Netlify Dashboard

1. Push your code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Click "Deploy" - Netlify will auto-detect Next.js settings!

That's it! Your site will be live at `your-site.netlify.app`

## 📁 Project Structure

```
seizoons/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main dashboard page
├── netlify.toml         # Netlify configuration
└── package.json         # Dependencies
```

## 🎨 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Netlify** - Hosting

## 🔮 Next Steps

- [ ] Connect to Mintify API for real NFT holder data
- [ ] Integrate Alchemy for onchain analytics
- [ ] Add Twitter API integration
- [ ] Create interactive charts with Recharts

## 💡 Features

Currently showing:
- ✅ Beautiful gradient UI
- ✅ Responsive design (mobile-friendly)
- ✅ Stats cards with mock data
- ✅ Onchain analytics section
- ✅ Twitter metrics section

## 📝 License

MIT - Feel free to use for your own NFT communities!

---

**Built with ❤️ for the Snoozies Community**
