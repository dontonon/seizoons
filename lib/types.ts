// Types for the Snoozies NFT Dashboard

/**
 * NFT Holder data from Mintify API
 */
export interface NFTHolder {
  address: string;
  tokenCount: number;
}

/**
 * Token holdings for a wallet (ERC20 tokens)
 */
export interface TokenHolding {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  balance: string;
  decimals: number;
}

/**
 * Wallet analytics data
 */
export interface WalletAnalytics {
  address: string;
  transactionCount: number;
  gasSpent: string; // in ETH
  walletAge: number; // in days
  firstTransactionDate: string;
  tokens: TokenHolding[];
}

/**
 * Aggregated onchain analytics
 */
export interface OnchainAnalytics {
  totalHolders: number;
  uniqueTokensHeld: number; // Total unique ERC20 tokens across all holders
  averageTransactionCount: number;
  averageWalletAge: number; // in days
  holderDistribution: {
    singleToken: number; // Holders with 1 NFT
    smallHolder: number; // 2-5 NFTs
    mediumHolder: number; // 6-10 NFTs
    largeHolder: number; // 11+ NFTs
  };
  walletAgeDistribution: {
    new: number; // < 30 days
    intermediate: number; // 30-180 days
    experienced: number; // 180-365 days
    veteran: number; // 365+ days
  };
}

/**
 * Twitter user profile data
 */
export interface TwitterProfile {
  id: string;
  username: string;
  name: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  verified: boolean;
}

/**
 * Aggregated Twitter community metrics
 */
export interface TwitterMetrics {
  totalMembers: number;
  combinedFollowers: number;
  averageFollowersPerMember: number;
  verifiedAccountsCount: number;
  topInfluencers: TwitterProfile[]; // Top 10 by followers
}

/**
 * Dashboard data combining all analytics
 */
export interface DashboardData {
  onchain: OnchainAnalytics;
  twitter: TwitterMetrics;
  lastUpdated: string;
}
