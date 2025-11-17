import { NextResponse } from 'next/server';

/**
 * API Route: NFT Portfolio Overlap Analysis
 *
 * Analyzes what OTHER NFT collections your holders own.
 * Great for finding collaboration opportunities and understanding community interests.
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

    const alchemyUrl = `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}`;

    // Sample subset for analysis
    const sampleSize = Math.min(addresses.length, 30);
    const sampleAddresses = addresses.slice(0, sampleSize);

    const nftCollections = new Map<string, {
      count: number;
      name: string;
      contractAddress: string;
      floorPrice?: string;
    }>();

    for (const address of sampleAddresses) {
      try {
        // Fetch NFTs owned by this wallet
        const response = await fetch(
          `${alchemyUrl}/getNFTsForOwner?owner=${address}&pageSize=100&excludeFilters[]=SPAM`,
          {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        const nfts = data.ownedNfts || [];

        // Count collections
        nfts.forEach((nft: any) => {
          const contractAddress = nft.contract?.address?.toLowerCase();
          if (!contractAddress) return;

          // Skip our own collection
          if (contractAddress === process.env.NEXT_PUBLIC_NFT_CONTRACT?.toLowerCase()) return;

          if (nftCollections.has(contractAddress)) {
            nftCollections.get(contractAddress)!.count++;
          } else {
            nftCollections.set(contractAddress, {
              count: 1,
              name: nft.contract?.name || 'Unknown Collection',
              contractAddress: nft.contract?.address,
              floorPrice: nft.contract?.openSeaMetadata?.floorPrice?.toString(),
            });
          }
        });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`Error analyzing NFTs for ${address}:`, error);
      }
    }

    // Sort by popularity
    const topCollections = Array.from(nftCollections.entries())
      .map(([address, data]) => ({
        ...data,
        percentage: sampleSize > 0 ? ((data.count / sampleSize) * 100).toFixed(1) : 0,
        holders: data.count,
      }))
      .sort((a, b) => b.holders - a.holders)
      .slice(0, 15);

    return NextResponse.json({
      topCollections,
      stats: {
        walletsAnalyzed: sampleSize,
        uniqueCollectionsFound: nftCollections.size,
        averageCollectionsPerWallet: sampleSize > 0
          ? (Array.from(nftCollections.values()).reduce((sum, c) => sum + c.count, 0) / sampleSize).toFixed(1)
          : 0,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing NFT portfolio:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze NFT portfolio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
