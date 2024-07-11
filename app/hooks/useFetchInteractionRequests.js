// hooks/useFetchInteractionRequests.js
import { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { useUser } from '@clerk/nextjs';

const useFetchInteractionRequests = () => {
  const [interactionRequests, setInteractionRequests] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchRequests = () => {
      const interactionRequestsRef = ref(database, 'interactionRequests');
      onValue(interactionRequestsRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const requests = await Promise.all(
            Object.values(data)
              .filter(request => request.receiverId === user.id && request.status === 'pending')
              .map(async (request) => {
                const { senderId } = request;
                const sender = await fetchUserDetails(senderId);
                return {
                  ...request,
                  senderNickname: sender.publicMetadata.nickname || 'Anonymous',
                };
              })
          );
          setInteractionRequests(requests);
        } else {
          setInteractionRequests([])
        }
      });
    };

    fetchRequests();
  }, [user]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch('/api/clerk/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        console.error(`Failed to fetch from /api/clerk/get-user with status: ${response.status});
        throw new Error(HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { publicMetadata: { nickname: 'Anonymous' } };
    }
  };

  return interactionRequests;
};

export default useFetchInteractionRequests;
