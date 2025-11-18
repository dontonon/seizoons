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
    veryNew: number; // < 6 months
    new: number; // 6-12 months
    intermediate: number; // 1-3 years
    experienced: number; // 3-5 years
    veteran: number; // 5+ years
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
 * DeFi Protocol Usage
 */
export interface DeFiProtocolUsage {
  protocolName: string;
  protocolAddress: string;
  userCount: number;
  percentage: number;
}

/**
 * Airdrop Token Holdings
 */
export interface AirdropHolding {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  holderCount: number;
  percentage: number;
}

/**
 * Transaction Timing Patterns
 */
export interface TransactionTiming {
  hourDistribution: number[]; // 24 hours
  dayDistribution: number[]; // 7 days (0=Sunday)
  peakHour: number;
  peakDay: string;
}

/**
 * Wallet Behavior Categories
 */
export interface WalletBehaviorPattern {
  category: 'Trader' | 'HODLer' | 'DeFi User' | 'NFT Collector' | 'Whale' | 'Bot';
  count: number;
  percentage: number;
  avgTransactions: number;
  avgGasSpent: number;
}

/**
 * Cross-Chain Activity
 */
export interface ChainActivity {
  chainName: string;
  chainId: number;
  activeWallets: number;
  percentage: number;
  totalTransactions: number;
  avgGasSpent: number;
}

/**
 * Advanced Analytics combining DeFi, Airdrops, Timing, and Behavior
 */
export interface AdvancedAnalytics {
  defiProtocols: DeFiProtocolUsage[];
  airdrops: AirdropHolding[];
  timing: TransactionTiming;
  behaviorPatterns: WalletBehaviorPattern[];
  defiAdoption: number; // % of wallets using DeFi
  airdropHunters: number; // % holding 3+ airdropped tokens
}

/**
 * Popular Token with holder statistics
 */
export interface PopularToken extends TokenHolding {
  holderCount: number;
  holderPercentage: number;
}

/**
 * Top Holder (whale) information
 */
export interface TopHolder {
  address: string;
  tokenCount: number;
  rank: number;
}

/**
 * NFT Collection held by community members
 */
export interface NFTCollection {
  name: string;
  symbol: string;
  contractAddress: string;
  chain: string; // Ethereum, Base, etc.
  holderCount: number;
  holderPercentage: number;
  floorPrice?: number; // in ETH
  isBlueChip: boolean;
}

/**
 * Dashboard data combining all analytics
 */
export interface DashboardData {
  onchain: OnchainAnalytics;
  twitter: TwitterMetrics;
  advanced?: AdvancedAnalytics;
  timing?: TransactionTiming;
  defiProtocols?: DeFiProtocolUsage[];
  defiAdoption?: number;
  airdrops?: AirdropHolding[];
  airdropHunters?: number;
  behaviorPatterns?: WalletBehaviorPattern[];
  chainActivity?: ChainActivity[];
  multiChainUsers?: number;
  nftCollections?: NFTCollection[];
  topTokens?: PopularToken[];
  topHolders?: TopHolder[];
  lastUpdated: string;
}
