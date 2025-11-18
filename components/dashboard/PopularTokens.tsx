'use client';

/**
 * PopularTokens Component
 *
 * Displays the most popular ERC20 tokens held by NFT holders
 * Shows what the community is interested in beyond just NFTs
 */
interface TokenData {
  tokenSymbol: string;
  tokenName: string;
  holderCount: number;
  holderPercentage: number;
}

interface PopularTokensProps {
  tokens: TokenData[];
}

export default function PopularTokens({ tokens }: PopularTokensProps) {
  if (!tokens || tokens.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        💎 Popular ERC20 Tokens
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Top tokens held by the community - shows real DeFi engagement
      </p>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {token.tokenSymbol}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {token.tokenName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {token.holderCount} holders
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                {token.holderPercentage}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {tokens.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No token data available
        </p>
      )}
    </div>
  );
}
