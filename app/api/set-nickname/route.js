import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
export async function POST(req) {
  const { nickname, userId } = await req.json();
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        nickname
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating nickname:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
