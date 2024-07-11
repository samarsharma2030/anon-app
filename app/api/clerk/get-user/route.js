// app/api/clerk/get-user/route.js
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  const { userId } = await req.json();

  try {
    const user = await clerkClient.users.getUser(userId);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
