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
export const MAX_WALLETS_FOR_ADVANCED = 20; // Limit for advanced analytics (DeFi, timing, behavior)

/**
 * Wallet age thresholds (in days)
 * 5 categories for better granularity
 */
export const WALLET_AGE_THRESHOLDS = {
  VERY_NEW: 180,      // < 6 months
  NEW: 365,           // 6-12 months
  INTERMEDIATE: 1095, // 1-3 years
  EXPERIENCED: 1825,  // 3-5 years
  // 5+ years = veteran
};

/**
 * DeFi Protocol Addresses on Base Chain
 */
export const DEFI_PROTOCOLS = {
  // Uniswap V2 & V3
  UNISWAP_V2_ROUTER: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  UNISWAP_V3_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481',

  // Aerodrome (Major Base DEX)
  AERODROME_ROUTER: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',

  // BaseSwap
  BASESWAP_ROUTER: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86',

  // Aave V3
  AAVE_POOL: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',

  // Compound
  COMPOUND_COMET: '0x46e6b214b524310239732D51387075E0e70970bf',

  // MorphoBlue
  MORPHO: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',

  // Stargate (Bridge)
  STARGATE_ROUTER: '0x45f1A95A4D3f3836523F5c83673c797f4d4d263B',
};

/**
 * Known Popular Token Addresses on Base Chain
 * These are Base-native tokens that holders might have
 */
export const AIRDROP_TOKENS = {
  // Base chain native tokens
  DEGEN: { symbol: 'DEGEN', name: 'Degen', address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
  BRETT: { symbol: 'BRETT', name: 'Brett', address: '0x532f27101965dd16442E59d40670FaF5eBB142E4' },
  TOSHI: { symbol: 'TOSHI', name: 'Toshi', address: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' },
};

/**
 * Wallet Behavior Thresholds
 */
export const BEHAVIOR_THRESHOLDS = {
  TRADER_MIN_TXS: 100, // High tx count = trader
  HODLER_MAX_TXS: 20, // Low tx count = hodler
  WHALE_MIN_NFTS: 5, // 5+ NFTs = whale
  BOT_TPS_THRESHOLD: 50, // Transactions per day threshold
  DEFI_MIN_PROTOCOLS: 2, // Using 2+ DeFi protocols
};
