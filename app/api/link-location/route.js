// app/api/link-location/route.js
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    const { latitude, longitude, userId } = await req.json();
    // Update the user's metadata with the location
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { latitude, longitude }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error linking location:", error);
    return NextResponse.json({ error: "Failed to link location" }, { status: 500 });
  }
}
