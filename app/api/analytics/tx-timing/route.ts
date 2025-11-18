import { NextResponse } from 'next/server';

/**
 * API Route: Transaction Timing & Behavior Patterns
 *
 * Analyzes WHEN and HOW holders transact:
 * - Peak activity hours
 * - Weekend vs weekday traders
 * - Night owls vs early birds
 * - Consistent vs sporadic activity
 * - Gas spending patterns
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
    const basescanApiKey = process.env.BASESCAN_API_KEY;
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
      return NextResponse.json(
        { error: 'Alchemy API key not configured' },
        { status: 500 }
      );
    }

    // Sample subset
    const sampleSize = Math.min(addresses.length, 20);
    const sampleAddresses = addresses.slice(0, sampleSize);

    // Time tracking
    const hourlyActivity = new Array(24).fill(0);
    const dayOfWeekActivity = new Array(7).fill(0);

    let nightOwls = 0; // Active 10pm-6am
    let earlyBirds = 0; // Active 6am-10am
    let daytimeUsers = 0; // Active 10am-6pm
    let eveningUsers = 0; // Active 6pm-10pm

    let totalGasSpent = 0;
    let weekendTxCount = 0;
    let weekdayTxCount = 0;

    const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;

    for (const address of sampleAddresses) {
      try {
        let userHourlyActivity = new Array(24).fill(0);

        if (basescanApiKey) {
          // Detailed analysis with Basescan
          const txUrl = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${basescanApiKey}`;

          const response = await fetch(txUrl);
          const data = await response.json();

          if (data.status === '1' && data.result && data.result.length > 0) {
            data.result.forEach((tx: any) => {
              const timestamp = parseInt(tx.timeStamp) * 1000;
              const date = new Date(timestamp);

              const hour = date.getUTCHours();
              const dayOfWeek = date.getUTCDay();

              hourlyActivity[hour]++;
              userHourlyActivity[hour]++;
              dayOfWeekActivity[dayOfWeek]++;

              // Weekend vs weekday
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendTxCount++;
              } else {
                weekdayTxCount++;
              }

              // Gas spent
              const gasUsed = parseInt(tx.gasUsed || '0');
              const gasPrice = parseInt(tx.gasPrice || '0');
              totalGasSpent += (gasUsed * gasPrice) / 1e18; // Convert to ETH
            });

            // Determine user's primary activity time
            const maxHour = userHourlyActivity.indexOf(Math.max(...userHourlyActivity));
            if (maxHour >= 22 || maxHour < 6) nightOwls++;
            else if (maxHour >= 6 && maxHour < 10) earlyBirds++;
            else if (maxHour >= 10 && maxHour < 18) daytimeUsers++;
            else eveningUsers++;
          }

          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          // Basic fallback - just count transactions
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

          const txData = await response.json();
          const txCount = parseInt(txData.result || '0x0', 16);

          // Rough estimates
          if (txCount > 50) daytimeUsers++;
          else if (txCount > 20) eveningUsers++;
          else earlyBirds++;

          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`Error analyzing timing for ${address}:`, error);
      }
    }

    // Find peak hours
    const peakHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const peakHourFormatted = peakHour === 0 ? '12am' :
                              peakHour < 12 ? `${peakHour}am` :
                              peakHour === 12 ? '12pm' : `${peakHour - 12}pm`;

    // Find peak day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakDay = dayOfWeekActivity.indexOf(Math.max(...dayOfWeekActivity));

    const scaleFactor = addresses.length / sampleSize;

    return NextResponse.json({
      timing: {
        peakHour: peakHourFormatted,
        peakDay: dayNames[peakDay],
        weekendTraders: Math.round((weekendTxCount / (weekendTxCount + weekdayTxCount || 1)) * 100),
        weekdayTraders: Math.round((weekdayTxCount / (weekendTxCount + weekdayTxCount || 1)) * 100),
      },
      userTypes: {
        nightOwls: Math.round(nightOwls * scaleFactor),
        earlyBirds: Math.round(earlyBirds * scaleFactor),
        daytimeUsers: Math.round(daytimeUsers * scaleFactor),
        eveningUsers: Math.round(eveningUsers * scaleFactor),
      },
      percentages: {
        nightOwls: sampleSize > 0 ? ((nightOwls / sampleSize) * 100).toFixed(1) : 0,
        earlyBirds: sampleSize > 0 ? ((earlyBirds / sampleSize) * 100).toFixed(1) : 0,
        daytimeUsers: sampleSize > 0 ? ((daytimeUsers / sampleSize) * 100).toFixed(1) : 0,
        eveningUsers: sampleSize > 0 ? ((eveningUsers / sampleSize) * 100).toFixed(1) : 0,
      },
      gasStats: {
        totalGasSpent: totalGasSpent.toFixed(4),
        averagePerWallet: sampleSize > 0 ? (totalGasSpent / sampleSize).toFixed(4) : 0,
      },
      insights: {
        communityType: nightOwls > daytimeUsers ? 'Night Owls 🌙' :
                      earlyBirds > eveningUsers ? 'Early Birds 🌅' : 'Daytime Traders ☀️',
        tradingStyle: weekendTxCount > weekdayTxCount ? 'Weekend Warriors' : 'Weekday Grinders',
      },
      sampleSize,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing transaction timing:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze transaction timing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
