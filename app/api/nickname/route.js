// app/api/nickname/route.js
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const { nickname, userId } = await req.json();
    // Check if the nickname already exists
    const users = await clerkClient.users.getUserList({
      limit: 1,
      publicMetadata: { nickname }
    });
    if (users.length > 0) {
      return NextResponse.json({ error: "Nickname already taken" }, { status: 400 });
    }
    // Update the user's metadata with the nickname
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { nickname }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating nickname:", error);
    return NextResponse.json({ error: "Failed to update nickname" }, { status: 500 });
  }
}