# API Setup Guide for Snoozies Dashboard

This guide will help you configure the APIs to power your Snoozies NFT Dashboard.

## Current Configuration

Your `.env.local` file has been created with:
- ✅ **Alchemy API Key**: Already configured
- ✅ **NFT Contract**: `0x61a85534f124781231BaB486b111534D9653f19a`
- ✅ **Network**: Base (Chain ID: 8453)

## APIs to Configure

### 1. Mintify API (NFT Holder Data) - REQUIRED

**What it does**: Fetches the total number of NFT holders and distribution data.

**How to get your API key**:
1. Visit https://learn.mintify.xyz/api
2. Sign up for a Mintify API account
3. Get your API key from the dashboard
4. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_MINTIFY_API_KEY=your_mintify_api_key_here
   ```

**Status**: Ready to use once API key is added

---

### 2. Alchemy API (Onchain Analytics) - CONFIGURED ✅

**What it does**: Analyzes wallet activity, token holdings, and transaction history.

**Status**: Already configured with your API key `_JABrd5LH-UHydmK-e-De`

**Features enabled**:
- Wallet age analysis
- Token balance tracking
- Transaction history
- Gas spent analytics

---

### 3. Twitter/X API (Community Metrics) - OPTIONAL

**What it does**: Fetches real Twitter community data from your Snoozies lists.

**Two Lists Configured**:
- List 1: `1912044368472560061`
- List 2: (You mentioned a second list - can add if needed)

**What Twitter data you'll get**:
- Total community members across lists
- Combined follower count
- Average followers per member
- Number of verified accounts
- Top 10 influencers in community

**How to set up Twitter API**:

#### Option 1: Free Tier (Recommended for starting)
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Sign up for a developer account (Free tier available)
3. Create a new Project and App
4. Under "Keys and Tokens", generate a **Bearer Token**
5. Add to `.env.local`:
   ```
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

#### Option 2: Basic Tier ($100/month)
- Higher rate limits (10,000 tweets/month)
- Better for larger communities
- Same setup as Free tier

**Required API Permissions**:
- Read access to Lists
- Read access to Users
- Read access to Tweets (for engagement metrics)

**Specific API Endpoints Used**:
- `GET /2/lists/:id/members` - Fetch list members
- With `user.fields=public_metrics,verified,created_at` for detailed stats

#### What You Need to Request:
When applying for Twitter API access, tell them:
- **Use case**: "NFT community analytics dashboard"
- **What data**: "Fetch public Twitter list members and their follower counts"
- **Purpose**: "Display aggregate community metrics for Snoozies NFT holders"

---

## Testing Your Setup

### Step 1: Test Mintify API
Once you add your Mintify API key, test it:
```bash
npm run dev
```

Then visit: http://localhost:3000/api/mintify/holders

Expected response:
```json
{
  "totalHolders": 1234,
  "collectionData": {...},
  "timestamp": "2025-01-17T..."
}
```

### Step 2: Test Alchemy API (Already works!)
Visit: http://localhost:3000/api/onchain/token-balances?addresses=0x123...

### Step 3: Test Twitter API
Once you add your bearer token, visit:
http://localhost:3000/api/twitter/metrics

Expected response:
```json
{
  "metrics": {
    "totalMembers": 856,
    "combinedFollowers": 5678000,
    "averageFollowersPerMember": 6632,
    "verifiedAccountsCount": 23,
    "topInfluencers": [...]
  }
}
```

---

## Priority Order

**Start with these in order**:

1. **Mintify API** (Most important - shows holder count on dashboard)
   - Sign up at https://learn.mintify.xyz/api
   - Add key to `.env.local`
   - Restart dev server

2. **Twitter API** (Optional but powerful for community metrics)
   - Only if you want to showcase your community reach
   - Can skip if you just want NFT data

3. **Basescan API** (Optional - enhances transaction data)
   - Free tier at https://basescan.org/apis
   - Adds more detailed wallet analytics

---

## Questions?

**Which API should I prioritize?**
→ Start with Mintify to show real holder data. That's the core metric.

**Is Twitter API free?**
→ Yes, Twitter has a free tier. Perfect for testing. You can upgrade later if needed.

**What if I don't want Twitter metrics?**
→ No problem! The dashboard works fine with just Mintify + Alchemy.

**How much does this cost?**
- Mintify: Check their pricing (likely has free tier)
- Alchemy: Free tier includes 300M compute units/month (plenty for this)
- Twitter: Free tier available, $100/month for Basic
- Basescan: Free tier available

---

## Next Steps

1. Get your Mintify API key
2. Add it to `.env.local`
3. Restart your dev server: `npm run dev`
4. Visit http://localhost:3000 to see real holder data!

Then optionally add Twitter API for community metrics.
