// Constants for the Snoozies NFT Dashboard

/**
 * NFT Collection Details
 */
export const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT || '0x61a85534f124781231BaB486b111534D9653f19a';
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'); // Base chain
export const CHAIN_NAME = 'Base';

/**
 * Mintify API Configuration
 */
export const MINTIFY_API_BASE = 'https://api.mintify.com';

/**
 * Base Chain Configuration
 */
export const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';
export const BASESCAN_API_URL = 'https://api.basescan.org/api';

/**
 * Twitter Lists to fetch members from
 */
export const TWITTER_LISTS = [
  '1912044368472560061',
  '1921828985392046339',
];

/**
 * API Rate limiting and caching
 */
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
export const MAX_WALLETS_TO_ANALYZE = 100; // Limit for deep wallet analysis to avoid rate limits

/**
 * Wallet age thresholds (in days)
 */
export const WALLET_AGE_THRESHOLDS = {
  NEW: 30,
  INTERMEDIATE: 180,
  EXPERIENCED: 365,
};
