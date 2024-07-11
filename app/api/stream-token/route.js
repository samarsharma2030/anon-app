// pages/api/stream-token.js
import { StreamChat } from 'stream-chat';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const serverClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY, process.env.STREAM_API_SECRET);

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Ensure the user exists in StreamChat
    const user = await serverClient.upsertUser({ id: userId });

    // Generate a token for the authenticated user
    const token = serverClient.createToken(userId);

    return NextResponse.json({ token, userInfo: { name: user.name, image: user.image } });
  } catch (error) {
    console.error('Failed to generate Stream token:', error);
    return NextResponse.json({ error: 'Failed to generate Stream token', details: error.message }, { status: 500 });
  }
}
