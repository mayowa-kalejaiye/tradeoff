import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Integrate with Sendbyte.africa API
    // Using generic REST convention as specified
    const SENDBYTE_API_KEY = process.env.SENDBYTE_API_KEY || 'test_key';
    
    // Attempting connection to sendbyte.africa API
    const response = await fetch('https://api.sendbyte.africa/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDBYTE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        list_id: 'tradeoff_waitlist',
        source: 'landing_page'
      })
    });

    if (!response.ok) {
      console.error(`Sendbyte.africa API error: ${response.statusText}`);
      // Fallback for development/testing if API key is invalid or endpoint mock fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('DEV MODE: Mocking successful subscription to sendbyte.africa');
        return NextResponse.json({ success: true, mocked: true });
      }
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
