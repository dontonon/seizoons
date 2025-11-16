import { NextResponse } from 'next/server';

/**
 * Demo/Mock Data for Dashboard
 * Use this when API keys aren't configured
 */
export async function GET() {
  // Return realistic demo data
  const demoData = {
    onchain: {
      totalHolders: 847,
      uniqueTokensHeld: 156,
      averageTransactionCount: 234,
      averageWalletAge: 456,
      holderDistribution: {
        singleToken: 421,
        smallHolder: 298,
        mediumHolder: 89,
        largeHolder: 39,
      },
      walletAgeDistribution: {
        new: 127,
        intermediate: 356,
        experienced: 248,
        veteran: 116,
      },
    },
    twitter: {
      totalMembers: 1243,
      combinedFollowers: 2847562,
      averageFollowersPerMember: 2291,
      verifiedAccountsCount: 47,
      topInfluencers: [
        { id: '1', username: 'cryptowhale', name: 'Crypto Whale', followersCount: 456789, followingCount: 1234, tweetCount: 5678, verified: true },
        { id: '2', username: 'nftcollector', name: 'NFT Collector', followersCount: 234567, followingCount: 987, tweetCount: 3456, verified: true },
        { id: '3', username: 'defimaster', name: 'DeFi Master', followersCount: 198765, followingCount: 654, tweetCount: 2345, verified: false },
        { id: '4', username: 'basebuilder', name: 'Base Builder', followersCount: 156789, followingCount: 432, tweetCount: 1987, verified: true },
        { id: '5', username: 'web3dev', name: 'Web3 Dev', followersCount: 123456, followingCount: 321, tweetCount: 1654, verified: false },
      ],
    },
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  };

  return NextResponse.json(demoData);
}
