import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tier = formData.get('tier'); // 'single' or 'pro'

    // Mock bachs.io integration
    const BACHS_API_KEY = process.env.BACHS_API_KEY || 'test_key';
    
    const priceId = tier === 'pro' ? 'price_pro_monthly' : 'price_single_report';
    const amount = tier === 'pro' ? 4900 : 500; // in cents
    
    // Simulate Bachs.io checkout session creation
    console.log(`[Bachs.io API] Creating checkout session for tier: ${tier}`);
    
    const bachsPayload = {
      line_items: [{ price: priceId, quantity: 1 }],
      mode: tier === 'pro' ? 'subscription' : 'payment',
      success_url: `${request.headers.get('origin')}/app?checkout=success`,
      cancel_url: `${request.headers.get('origin')}/pricing?checkout=cancelled`,
    };

    // In a real integration, we'd make a fetch call:
    // const response = await fetch('https://api.bachs.io/v1/checkout/sessions', { ... })
    // const session = await response.json();
    
    // For now, redirect to the success URL to simulate successful flow
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.redirect(new URL('/app?checkout=success', request.url));
    }

    return NextResponse.json({ error: 'Bachs.io integration requires production API keys.' }, { status: 500 });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
