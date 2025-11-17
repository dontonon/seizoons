import { NextResponse } from 'next/server';

/**
 * API Route: Wallet Activity Analysis
 *
 * Analyzes transaction activity, gas spent, and engagement levels
 * of holder wallets on Base network.
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

    const addresses = addressesParam.split(',');
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

    // Sample subset for analysis
    const sampleSize = Math.min(addresses.length, 50);
    const sampleAddresses = addresses.slice(0, sampleSize);

    let totalTransactions = 0;
    let activeWallets = 0; // Wallets with 5+ transactions
    let veryActiveWallets = 0; // Wallets with 50+ transactions
    const transactionCounts: number[] = [];

    for (const address of sampleAddresses) {
      try {
        // Get transaction count
        const response = await fetch(alchemyUrl, {
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

        totalTransactions += txCount;
        transactionCounts.push(txCount);

        if (txCount >= 5) activeWallets++;
        if (txCount >= 50) veryActiveWallets++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`Error analyzing activity for ${address}:`, error);
      }
    }

    // Calculate statistics
    const averageTxCount = sampleSize > 0 ? Math.round(totalTransactions / sampleSize) : 0;

    // Categorize by activity level
    let inactive = 0;
    let lowActivity = 0;
    let mediumActivity = 0;
    let highActivity = 0;

    transactionCounts.forEach(count => {
      if (count === 0) inactive++;
      else if (count < 10) lowActivity++;
      else if (count < 50) mediumActivity++;
      else highActivity++;
    });

    // Extrapolate to full holder base
    const scaleFactor = addresses.length / sampleSize;

    return NextResponse.json({
      activity: {
        totalAnalyzed: sampleSize,
        totalHolders: addresses.length,
        averageTransactions: averageTxCount,
        totalTransactions: Math.round(totalTransactions * scaleFactor),
      },
      distribution: {
        inactive: Math.round(inactive * scaleFactor),
        lowActivity: Math.round(lowActivity * scaleFactor),
        mediumActivity: Math.round(mediumActivity * scaleFactor),
        highActivity: Math.round(highActivity * scaleFactor),
      },
      percentages: {
        active: sampleSize > 0 ? ((activeWallets / sampleSize) * 100).toFixed(1) : 0,
        veryActive: sampleSize > 0 ? ((veryActiveWallets / sampleSize) * 100).toFixed(1) : 0,
        inactive: sampleSize > 0 ? ((inactive / sampleSize) * 100).toFixed(1) : 0,
      },
      insights: {
        activeWallets: Math.round(activeWallets * scaleFactor),
        veryActiveWallets: Math.round(veryActiveWallets * scaleFactor),
        averagePerActive: activeWallets > 0
          ? Math.round(totalTransactions / activeWallets)
          : 0,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing wallet activity:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze wallet activity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
