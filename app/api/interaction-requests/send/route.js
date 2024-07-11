import { database } from '../../../../firebase'
import { ref, set } from "firebase/database";
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log("Received request for sending interaction request");
  try {
    const { senderId, receiverId } = await req.json();
    console.log(`Sender ID: ${senderId}, Receiver ID: ${receiverId}`);
    if (!senderId || !receiverId) {
      throw new Error("Sender ID or Receiver ID is missing");
    }

    const requestId = `${senderId}_${receiverId}`;
    console.log(`Request ID: ${requestId}`);
    const requestRef = ref(database, `interactionRequests/${requestId}`);
    
    await set(requestRef, {
      senderId,
      receiverId,
      status: 'pending',
    }).catch((firebaseError) => {
      console.error("Firebase operation failed:", firebaseError);
      throw new Error("Firebase operation failed");
    });

    console.log("Interaction request sent successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending interaction request:", error);
    return NextResponse.json({ error: "Failed to send interaction request", details: error.message }, { status: 500 });
  }
}