# Snoozies NFT Dashboard

A professional Next.js dashboard that showcases the Snoozies NFT community's value for airdrops and marketing partnerships. This dashboard combines onchain wallet analytics with Twitter community metrics to prove real community influence.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Snoozies+NFT+Dashboard)

## 🎯 Purpose

This dashboard answers: **"Why should projects partner with or airdrop to Snoozies holders?"**

It demonstrates:
- ✅ Onchain credibility (not just NFT flippers)
- ✅ Social reach (marketing value)
- ✅ Engagement (real humans, not bots)

## 🏗️ Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualizations
- **APIs**: Mintify, Base RPC, Basescan, Alchemy, Twitter/X

## 📊 Dashboard Features

### Section 1: Onchain Analytics
- Total unique NFT holders
- Token holdings diversity (ERC20 tokens held by community)
- Onchain activity scores (transaction count, gas spent, wallet age)
- Holder distribution (NFT concentration analysis)
- Wallet age distribution (new vs experienced users)

### Section 2: Twitter Community Metrics
- Total community members on X
- Combined follower count across all members
- Average followers per member
- Verified accounts count
- Top influencers visualization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys (see Configuration section)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seizoons
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your API keys** (see Configuration section below)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```env
# Mintify API (for NFT holder data)
NEXT_PUBLIC_MINTIFY_API_KEY=your_mintify_api_key_here

# Base Chain RPC URL
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Etherscan API Key (for Base chain via Basescan)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Alchemy API Key (for token balance analysis)
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Twitter/X API Credentials
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Collection Details (pre-configured for Snoozies)
NEXT_PUBLIC_NFT_CONTRACT=0x61a85534f124781231BaB486b111534D9653f19a
NEXT_PUBLIC_CHAIN_ID=8453
```

### Getting API Keys

#### 1. Mintify API
- Visit [Mintify Dashboard](https://mintify.com)
- Sign in and navigate to API settings
- Generate a new API key
- Copy to `NEXT_PUBLIC_MINTIFY_API_KEY`

#### 2. Etherscan API (For Base Chain)
- Visit [Etherscan](https://etherscan.io/apis)
- Create a free account
- Generate an API key
- Copy to `ETHERSCAN_API_KEY`
- **Note:** Basescan (Base chain explorer) uses Etherscan's infrastructure
- **Why?** Provides detailed transaction history for wallet analysis

#### 3. Alchemy API
- Visit [Alchemy](https://www.alchemy.com/)
- Sign up for a free account
- Create a new app (select Base network)
- Copy the API key to `ALCHEMY_API_KEY`
- **Why?** Fetches ERC20 token balances to show DeFi activity

#### 4. Twitter/X API
- Visit [Twitter Developer Portal](https://developer.twitter.com/)
- Create a new project and app
- Generate Bearer Token (v2 API access)
- Copy to `TWITTER_BEARER_TOKEN`
- **Why?** Fetches community member data from Twitter lists

## 📁 Project Structure

```
seizoons/
├── app/
│   ├── api/
│   │   ├── dashboard/         # Main aggregation endpoint
│   │   ├── mintify/           # Mintify API integration
│   │   ├── onchain/           # Base chain analytics
│   │   └── twitter/           # Twitter API integration
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard page
├── components/
│   └── dashboard/
│       ├── ErrorMessage.tsx   # Error state component
│       ├── HeroStats.tsx      # Hero stats cards
│       ├── LoadingSpinner.tsx # Loading state
│       ├── OnchainAnalytics.tsx # Onchain data visualizations
│       └── TwitterMetrics.tsx  # Twitter metrics & charts
├── lib/
│   ├── constants.ts           # App constants
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Utility functions
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔍 How It Works

### Data Flow

1. **Frontend** (`app/page.tsx`) calls `/api/dashboard`
2. **Dashboard API** orchestrates parallel requests to:
   - `/api/mintify/holders` - Fetches NFT holder addresses
   - `/api/twitter/metrics` - Aggregates Twitter community data
   - `/api/onchain/wallet-analytics` - Analyzes wallet activity
   - `/api/onchain/token-balances` - Fetches ERC20 holdings
3. **API Routes** fetch from external sources:
   - Mintify API for holder list
   - Twitter API for community metrics
   - Base RPC/Basescan for transaction data
   - Alchemy for token balances
4. **Response** is aggregated and returned to frontend
5. **Components** render visualizations using Recharts

### Caching & Performance

- API routes use Next.js caching (`revalidate: 300`) for 5-minute cache
- Wallet analysis limited to 100 wallets to avoid rate limits
- Requests are batched and rate-limited to respect API quotas
- Data is fetched in parallel where possible for faster load times

## 🎨 Customization

### Changing NFT Collection

To use this dashboard for a different NFT collection:

1. Update `.env`:
   ```env
   NEXT_PUBLIC_NFT_CONTRACT=0xYourContractAddress
   NEXT_PUBLIC_CHAIN_ID=8453  # or your chain
   ```

2. Update Twitter lists in `lib/constants.ts`:
   ```typescript
   export const TWITTER_LISTS = [
     'your_list_id_1',
     'your_list_id_2',
   ];
   ```

### Styling

- Colors and theme: Edit `tailwind.config.ts`
- Global styles: Edit `app/globals.css`
- Component styles: Tailwind classes in component files

## 📦 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Using Vercel CLI

```bash
# Login to Vercel
npx vercel login

# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

#### Option 2: Using Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `ALCHEMY_API_KEY`
     - `ETHERSCAN_API_KEY`
     - `NEXT_PUBLIC_MINTIFY_API_KEY`
     - `TWITTER_BEARER_TOKEN`
     - `NEXT_PUBLIC_NFT_CONTRACT`
     - `NEXT_PUBLIC_CHAIN_ID`
     - `NEXT_PUBLIC_BASE_RPC_URL`

4. **Deploy**
   - Vercel automatically deploys on push
   - Your dashboard will be live at `your-project.vercel.app`

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

### Other Platforms

This is a standard Next.js app and can be deployed to:
- **Netlify**: Use the Next.js plugin
- **Railway**: One-click deploy
- **AWS Amplify**: Import from GitHub
- **Self-hosted**: Build with `npm run build` and run `npm start`

## 🧪 Testing

### Manual Testing

1. Start the dev server: `npm run dev`
2. Check console for API errors
3. Verify data loads correctly
4. Test responsive design on mobile
5. Test error states by temporarily disabling API keys

### API Testing

Test individual API endpoints:

```bash
# Test Mintify integration
curl http://localhost:3000/api/mintify/holders

# Test Twitter integration
curl http://localhost:3000/api/twitter/metrics

# Test full dashboard
curl http://localhost:3000/api/dashboard
```

## 🐛 Troubleshooting

### Common Issues

**"Mintify API key not configured"**
- Ensure `NEXT_PUBLIC_MINTIFY_API_KEY` is set in `.env`
- Restart dev server after changing `.env`

**"Failed to fetch NFT holders"**
- Check Mintify API key is valid
- Verify contract address is correct
- Check Mintify API docs for endpoint changes

**"Twitter API error"**
- Ensure Bearer Token has v2 API access
- Check Twitter API rate limits
- Verify list IDs are accessible with your token

**Charts not showing**
- Check browser console for errors
- Ensure Recharts is installed: `npm install recharts`
- Verify data structure matches component expectations

**Slow loading**
- Reduce `MAX_WALLETS_TO_ANALYZE` in `lib/constants.ts`
- Check API rate limits aren't being hit
- Consider caching strategies

## 📝 Development Notes

### For New Developers

This codebase includes extensive comments to help you understand:
- How each API integration works
- What data is being fetched and why
- How components are structured
- Common patterns and best practices

Key files to start with:
1. `app/page.tsx` - Main dashboard (good overview)
2. `lib/types.ts` - Data structures
3. `app/api/dashboard/route.ts` - Data aggregation logic

### Best Practices

- Always use TypeScript types from `lib/types.ts`
- Add error handling for all API calls
- Use utility functions from `lib/utils.ts`
- Follow the existing component structure
- Test changes with different API responses

## 🔮 Future Enhancements (Phase 2+)

- [ ] Wallet → Twitter profile mapping
- [ ] Historical data tracking
- [ ] Export data as PDF/CSV
- [ ] Admin panel for configuration
- [ ] Real-time updates via WebSocket
- [ ] Additional blockchain analytics
- [ ] Engagement score algorithm
- [ ] Competitor comparison

## 📄 License

MIT License - feel free to use this for your own NFT communities!

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Built with ❤️ for the Snoozies community**
