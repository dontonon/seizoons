import { NextResponse } from 'next/server';

/**
 * API Route: Wallet Age Analysis
 *
 * Analyzes how long holder wallets have been active on Base network.
 * Categorizes wallets into:
 * - New (< 30 days)
 * - Intermediate (30-180 days)
 * - Experienced (180-365 days)
 * - Veteran (365+ days)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressesParam = searchParams.get('addresses');

    if (!addressesParam) {
      return NextResponse.json(
        { error: 'Addresses parameter required' },
        { status: 400 }
      );
    }

    const addresses = addressesParam.split(',').slice(0, 100); // Limit to 100 for performance
    const basescanApiKey = process.env.BASESCAN_API_KEY;
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    let newWallets = 0;
    let intermediate = 0;
    let experienced = 0;
    let veteran = 0;

    const now = Date.now();
    const results: any[] = [];

    // Sample a subset of wallets to analyze (to stay within rate limits)
    const sampleSize = Math.min(addresses.length, 50);
    const sampleAddresses = addresses.slice(0, sampleSize);

    for (const address of sampleAddresses) {
      try {
        let walletAgeDays = 0;

        if (basescanApiKey) {
          // Use Basescan to get first transaction
          const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${basescanApiKey}`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === '1' && data.result && data.result.length > 0) {
            const firstTxTimestamp = parseInt(data.result[0].timeStamp) * 1000;
            walletAgeDays = Math.floor((now - firstTxTimestamp) / (1000 * 60 * 60 * 24));
          }
        } else if (alchemyApiKey) {
          // Fallback: Use Alchemy to estimate based on transaction count
          const rpcUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
          const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getTransactionCount',
              params: [address, 'latest'],
              id: 1,
            }),
          });

          const data = await response.json();
          const txCount = parseInt(data.result || '0x0', 16);

          // Rough estimation: More transactions = older wallet
          if (txCount === 0) walletAgeDays = 15; // Very new
          else if (txCount < 10) walletAgeDays = 45; // New
          else if (txCount < 50) walletAgeDays = 120; // Intermediate
          else if (txCount < 200) walletAgeDays = 270; // Experienced
          else walletAgeDays = 400; // Veteran
        }

        // Categorize
        if (walletAgeDays < 30) newWallets++;
        else if (walletAgeDays < 180) intermediate++;
        else if (walletAgeDays < 365) experienced++;
        else veteran++;

        results.push({ address, walletAgeDays });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error analyzing wallet ${address}:`, error);
      }
    }

    // Extrapolate to full holder base
    const totalAnalyzed = newWallets + intermediate + experienced + veteran;
    const scaleFactor = addresses.length / totalAnalyzed;

    return NextResponse.json({
      distribution: {
        new: Math.round(newWallets * scaleFactor),
        intermediate: Math.round(intermediate * scaleFactor),
        experienced: Math.round(experienced * scaleFactor),
        veteran: Math.round(veteran * scaleFactor),
      },
      percentages: {
        new: totalAnalyzed > 0 ? ((newWallets / totalAnalyzed) * 100).toFixed(1) : 0,
        intermediate: totalAnalyzed > 0 ? ((intermediate / totalAnalyzed) * 100).toFixed(1) : 0,
        experienced: totalAnalyzed > 0 ? ((experienced / totalAnalyzed) * 100).toFixed(1) : 0,
        veteran: totalAnalyzed > 0 ? ((veteran / totalAnalyzed) * 100).toFixed(1) : 0,
      },
      sampleSize: totalAnalyzed,
      totalHolders: addresses.length,
      averageAge: results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.walletAgeDays, 0) / results.length)
        : 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing wallet age:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze wallet age',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
