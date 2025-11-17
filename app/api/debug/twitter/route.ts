import { NextResponse } from 'next/server';
import { TWITTER_LISTS } from '@/lib/constants';

/**
 * Debug endpoint to test Twitter API connection
 * Visit: /api/debug/twitter
 */
export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
      return NextResponse.json({
        error: 'No bearer token found',
        hasToken: false,
      }, { status: 500 });
    }

    // Test with first list
    const listId = TWITTER_LISTS[0];
    const url = `https://api.twitter.com/2/lists/${listId}/members?max_results=10&user.fields=public_metrics`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json({
      statusCode: response.status,
      statusText: response.statusText,
      hasToken: true,
      tokenLength: bearerToken.length,
      tokenStart: bearerToken.substring(0, 20) + '...',
      listId,
      url,
      response: data,
      headers: Object.fromEntries(response.headers.entries()),
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test Twitter API',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}
