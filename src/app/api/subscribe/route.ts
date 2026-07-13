import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscribers } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    try {
      await db.insert(subscribers).values({
        email: email.toLowerCase(),
        source: 'landing_page'
      });
    } catch (dbError: any) {
      // Postgres unique constraint violation code
      if (dbError.code === '23505') {
        // We can just pretend it succeeded so we don't leak information, or we can let them know.
        // Usually returning success is fine for subscriptions.
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      console.error('Database insertion error:', dbError);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
