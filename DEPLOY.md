# Deploying to Vercel

## Quick Deploy

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

## Environment Variables Setup

After deploying, add these environment variables in the Vercel dashboard:

### Required:
- `ALCHEMY_API_KEY` = `_JABrd5LH-UHydmK-e-De`
- `ETHERSCAN_API_KEY` = `RIDA2Y56M1N4489B4A9UG2REBSM413TD2R`
- `NEXT_PUBLIC_NFT_CONTRACT` = `0x61a85534f124781231BaB486b111534D9653f19a`
- `NEXT_PUBLIC_CHAIN_ID` = `8453`
- `NEXT_PUBLIC_BASE_RPC_URL` = `https://mainnet.base.org`

### Optional (add when ready):
- `NEXT_PUBLIC_MINTIFY_API_KEY` = Your Mintify API key
- `TWITTER_API_KEY` = Your Twitter API key
- `TWITTER_API_SECRET` = Your Twitter API secret
- `TWITTER_BEARER_TOKEN` = Your Twitter bearer token

## Deploy Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Post-Deploy

1. Get your deployment URL from Vercel
2. Update `NEXT_PUBLIC_BASE_URL` to your Vercel URL
3. Redeploy

## Dashboard Features

The dashboard includes:
- NFT holder analytics from Mintify
- On-chain wallet analysis via Alchemy
- Token balance tracking
- Twitter community metrics
- Real-time data updates
