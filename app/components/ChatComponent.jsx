// ChatComponent.jsx
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window, VirtualizedMessageList } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useUser } from '@clerk/nextjs';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const fetchStreamChatToken = async (userId) => {
  try {
    const response = await fetch('/api/stream-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error fetching StreamChat token:', error);
    throw error;
  }
};

const ChatComponent = ({ chatChannel, onDisconnect, onConnect, isMinimized, onToggleMinimize }) => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);
  const [chatChannelInstance, setChatChannelInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      if (user && !isUserConnected) {
        const client = StreamChat.getInstance(apiKey);
        try {
          const token = await fetchStreamChatToken(user.id);
          await client.connectUser({ id: user.id }, token);
          setChatClient(client);
          setIsUserConnected(true); // Indicate user is connected
        } catch (error) {
          console.error('Failed to connect user to StreamChat:', error);
        }
      }
    };

    initClient();
  }, [user, isUserConnected]);

  useEffect(() => {
    const initChat = async () => {
      if (chatClient && isUserConnected && chatChannel) { // Ensure user is connected
        try {
          const channel = chatClient.channel('messaging', chatChannel);
          await channel.watch();
          setChatChannelInstance(channel);
          setIsConnected(true); // Now the chat is fully connected
          if (typeof onConnect === 'function') {
            onConnect();
          }
        } catch (error) {
          console.error('Error initializing chat channel:', error);
        }
      }
    };

    initChat();
  }, [chatClient, isUserConnected, chatChannel, onConnect]);

  const handleDisconnect = () => {
    if (chatClient) {
      chatClient.disconnectUser();
      setIsConnected(false);
      setIsUserConnected(false);
      console.log('User disconnected from StreamChat');
      onDisconnect();
    }
  };

  if (!chatClient || !isConnected) return <div>Loading chat...</div>;

  if (isMinimized) {
    return (
      <div className='fixed bottom-0 right-0 mb-4 mr-4'>
        <button onClick={onToggleMinimize} className='bg-blue-500 text-white p-2 rounded'>Open Chat</button>
      </div>
    );
  }

  return (
    <div className="flex-col str-chat">
      <Chat client={chatClient} theme="messaging dark">
        <Channel channel={chatChannelInstance}>
          <Window>
            <MessageList />
            <MessageInput />
            <button onClick={handleDisconnect} className="mt-auto bg-red-500 text-white p-2 rounded">Disconnect Chat</button>
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatComponent;
