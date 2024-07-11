// streamChatUtils.js
import client from '../lib/getStream';

export const fetchStreamChatToken = async (userId) => {
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
};

export const connectUserToChat = async (user) => {
  if (user && !client.userID) {
    try {
      const token = await fetchStreamChatToken(user.id);
      await client.connectUser({ id: user.id }, token);
      console.log('User connected to StreamChat');
    } catch (error) {
      console.error('Failed to connect the user to StreamChat', error);
    }
  }
};