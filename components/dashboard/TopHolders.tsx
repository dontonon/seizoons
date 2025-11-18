'use client';

/**
 * TopHolders Component
 *
 * Displays the top 10 NFT holders (whales) in a ranked list
 */
interface TopHolder {
  address: string;
  tokenCount: number;
  rank: number;
}

interface TopHoldersProps {
  holders: TopHolder[];
}

export default function TopHolders({ holders }: TopHoldersProps) {
  if (!holders || holders.length === 0) {
    return null;
  }

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🐋 Top 10 Holders
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        The whales - wallets with the most NFTs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {holders.map((holder) => (
          <div
            key={holder.address}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-purple-900 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                <span className="text-sm">{getMedalEmoji(holder.rank)}</span>
              </div>
              <div>
                <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {shortenAddress(holder.address)}
                </div>
                <a
                  href={`https://basescan.org/address/${holder.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View on Basescan →
                </a>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-xl text-gray-900 dark:text-white">
                {holder.tokenCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                NFTs
              </div>
            </div>
          </div>
        ))}
      </div>

      {holders.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No holder data available
        </p>
      )}
    </div>
  );
}
