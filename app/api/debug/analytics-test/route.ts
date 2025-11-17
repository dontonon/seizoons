import { NextResponse } from 'next/server';

/**
 * Debug endpoint to test all analytics APIs
 * Visit: /api/debug/analytics-test
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // Test 1: Fetch holders
    console.log('Testing holders API...');
    const holdersRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/nft/holders-alchemy`);
    const holdersData = await holdersRes.json();
    results.tests.holders = {
      status: holdersRes.status,
      success: holdersRes.ok,
      data: holdersData,
      holders: holdersData.holders?.length || 0,
    };

    // Test 2: Holder distribution
    console.log('Testing distribution API...');
    const distRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/holder-distribution`);
    const distData = await distRes.json();
    results.tests.distribution = {
      status: distRes.status,
      success: distRes.ok,
      data: distData,
    };

    // Test 3: Wallet age (with sample addresses)
    if (holdersData.holders && holdersData.holders.length > 0) {
      console.log('Testing wallet age API...');
      const addresses = holdersData.holders.slice(0, 5).join(',');
      const ageRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/wallet-age?addresses=${addresses}`);
      const ageData = await ageRes.json();
      results.tests.walletAge = {
        status: ageRes.status,
        success: ageRes.ok,
        data: ageData,
      };
    }

    results.overall = 'Tests completed';
    return NextResponse.json(results);

  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
    results.stack = error instanceof Error ? error.stack : null;
    return NextResponse.json(results, { status: 500 });
  }
}
