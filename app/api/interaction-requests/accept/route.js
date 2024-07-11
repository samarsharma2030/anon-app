import { database } from '../../../../firebase';
import { ref, update } from 'firebase/database';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY, process.env.STREAM_API_SECRET);

async function connectUser(userId) {
  const user = await serverClient.upsertUser({ id: userId });
  const token = serverClient.createToken(userId);
  return { token, user };
}

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
    await update(requestRef, { status: 'accepted' });

    const { token: senderToken } = await connectUser(senderId);
    const { token: receiverToken } = await connectUser(receiverId);

    const channel = serverClient.channel('messaging', {
      members: [senderId, receiverId],
      created_by_id: receiverId
    });
    await channel.create();

    return NextResponse.json({ success: true, channelId: channel.id });
  } catch (error) {
    console.error('Error in POST /api/interaction-requests/accept:', error);
    return NextResponse.json({ error: 'Failed to accept interaction request', details: error.message }, { status: 500 });
  }
}
