"use client"

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import { useUser } from '@clerk/nextjs';

const useFetchUserChannels = () => {
  const { user } = useUser();
  const [channelId, setChannelId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const userChannelsRef = ref(database, `userChannels/${user.id}`);
    const unsubscribe = onValue(userChannelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.channelId) {
        setChannelId(data.channelId);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return channelId;
};

export default useFetchUserChannels;


{/* <ChatComponent chatChannel={channelId} onDisconnect={handleChatDisconnect} onConnect={(() => setIsChatConnected(true))} isMinimized={isChatMinimized} onToggleMinimize={toggleChatMinimized}/> */}