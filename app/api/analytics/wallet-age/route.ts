import { NextResponse } from 'next/server';

/**
 * API Route: Wallet Age Analysis
 *
 * Analyzes how long holder wallets have been active on Base network.
 * Categorizes wallets into:
 * - New (< 6 months)
 * - Intermediate (6-12 months)
 * - Experienced (1-3 years)
 * - Veteran (3-5 years)
 * - OG (5+ years)
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

    const addresses = addressesParam.split(',').slice(0, 100);
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    let newWallets = 0;       // < 6 months
    let intermediate = 0;     // 6-12 months
    let experienced = 0;      // 1-3 years
    let veteran = 0;          // 3-5 years
    let og = 0;               // 5+ years

    const now = Date.now();
    const results: any[] = [];

    // Sample subset for analysis
    const sampleSize = Math.min(addresses.length, 50);
    const sampleAddresses = addresses.slice(0, sampleSize);

    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

    for (const address of sampleAddresses) {
      try {
        // Get transaction count as proxy for wallet age
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

        // Estimate wallet age based on transaction count
        // More transactions typically means older wallet
        let walletAgeDays = 0;
        if (txCount === 0) walletAgeDays = 15;
        else if (txCount < 5) walletAgeDays = 90;
        else if (txCount < 20) walletAgeDays = 240;
        else if (txCount < 50) walletAgeDays = 450;
        else if (txCount < 100) walletAgeDays = 730;
        else if (txCount < 300) walletAgeDays = 1460;
        else walletAgeDays = 2000;

        // Categorize
        if (walletAgeDays < 180) newWallets++;        // < 6 months
        else if (walletAgeDays < 365) intermediate++; // 6-12 months
        else if (walletAgeDays < 1095) experienced++; // 1-3 years
        else if (walletAgeDays < 1825) veteran++;     // 3-5 years
        else og++;                                     // 5+ years

        results.push({ address, walletAgeDays, txCount });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error analyzing wallet ${address}:`, error);
      }
    }

    // Extrapolate to full holder base
    const totalAnalyzed = newWallets + intermediate + experienced + veteran + og;
    const scaleFactor = addresses.length / totalAnalyzed;

    return NextResponse.json({
      distribution: {
        new: Math.round(newWallets * scaleFactor),
        intermediate: Math.round(intermediate * scaleFactor),
        experienced: Math.round(experienced * scaleFactor),
        veteran: Math.round(veteran * scaleFactor),
        og: Math.round(og * scaleFactor),
      },
      percentages: {
        new: totalAnalyzed > 0 ? ((newWallets / totalAnalyzed) * 100).toFixed(1) : 0,
        intermediate: totalAnalyzed > 0 ? ((intermediate / totalAnalyzed) * 100).toFixed(1) : 0,
        experienced: totalAnalyzed > 0 ? ((experienced / totalAnalyzed) * 100).toFixed(1) : 0,
        veteran: totalAnalyzed > 0 ? ((veteran / totalAnalyzed) * 100).toFixed(1) : 0,
        og: totalAnalyzed > 0 ? ((og / totalAnalyzed) * 100).toFixed(1) : 0,
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
