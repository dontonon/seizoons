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
 * Known Airdrop Token Addresses
 */
export const AIRDROP_TOKENS = {
  // Major airdrops that holders might have
  ARB: { symbol: 'ARB', name: 'Arbitrum', address: '0x912CE59144191C1204E64559FE8253a0e49E6548' },
  OP: { symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042' },
  BLUR: { symbol: 'BLUR', name: 'Blur', address: '0x5283D291DBCF85356A21bA090E6db59121208b44' },
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
