"use client"

import { useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth } from '@clerk/nextjs';



const useInteractionRequestNotification = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const interactionRequestsRef = ref(db, 'interactionRequests');

    const unsubscribe = onValue(interactionRequestsRef, (snapshot) => {
      const requests = snapshot.val();
      if (requests) {
        Object.keys(requests).forEach((key) => {
          const request = requests[key];
          if (request.receiverId === user.id) {
            alert(`New interaction request from ${request.senderId}`);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [user]);
};

export default useInteractionRequestNotification;
