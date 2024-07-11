import { database } from '../../../../firebase';
import { ref, update } from 'firebase/database';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const { senderId, receiverId } = await req.json();
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (userId !== receiverId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const requestId = `${senderId}_${receiverId}`;
    const requestRef = ref(database, `interactionRequests/${requestId}`);
    await update(requestRef, { status: 'rejected' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting interaction request:', error);
    return NextResponse.json({ error: 'Failed to reject interaction request', details: error.message }, { status: 500 });
  }
}
