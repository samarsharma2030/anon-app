import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// The POST handler for fetching nearby users
export async function POST(req) {
  try {
    // Parse the request body to get latitude, longitude, and the requesting user's ID
    const { latitude, longitude, userId } = await req.json();
    console.log('Received request to fetch nearby users with:', { latitude, longitude, userId });

    // Validate the received data
    if (latitude === undefined || longitude === undefined || userId === undefined) {
      console.log('Latitude, longitude, or userId missing');
      return NextResponse.json({ error: "Latitude, longitude, and userId are required" }, { status: 400 });
    }

    // Fetch all users from the Clerk users list
    const response = await clerkClient.users.getUserList();
    console.log('Fetched all users:', response);

    // Assuming the response structure is { data: [users] }, adjust if necessary
    const allUsers = response.data ? response.data : [];
    if (!Array.isArray(allUsers)) {
      console.error('allUsers is not an array:', allUsers);
      return NextResponse.json({ error: 'Unexpected response structure', details: 'allUsers is not an array' }, { status: 500 });
    }

    // Filter nearby users excluding the requesting user
    const nearbyUsers = allUsers.filter(user => {
      // Exclude the requesting user based on ID
      if (user.id === userId) {
        console.log(`Excluding requesting user ${userId} from results`);
        return false;
      }

      const userLat = user.publicMetadata?.latitude;
      const userLong = user.publicMetadata?.longitude;
      console.log('Checking user:', { userId: user.id, userLat, userLong });

      if (userLat === undefined || userLong === undefined) {
        console.log(`Skipping user ${user.id} due to missing location`);
        return false;
      }

      // Simple distance check logic
      const latDiff = Math.abs(userLat - latitude);
      const longDiff = Math.abs(userLong - longitude);
      console.log(`User ${user.id} latDiff: ${latDiff}, longDiff: ${longDiff}`);

      return latDiff < 1 && longDiff < 1;
    });

    console.log('Filtered nearby users:', nearbyUsers);
    return NextResponse.json({ users: nearbyUsers });
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby users', details: error.message }, { status: 500 });
  }
}