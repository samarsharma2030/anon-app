import React from 'react';
import { useUser } from '@clerk/nextjs';
import useFetchInteractionRequests from '../hooks/useFetchInteractionRequests';
import client from '../lib/getStream';
import { connectUserToChat } from '../utils/streamChatutils'

const InteractionRequests = ({ onAccept }) => {
  console.log('InteractionRequests onAccept:', onAccept); // Add logging

  const { user } = useUser();
  const interactionRequests = useFetchInteractionRequests();

  const fetchStreamChatToken = async (userId) => {
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

  const handleAccept = async (senderId) => {
    if (!user || typeof onAccept !== 'function') return;

    try {
      await connectUserToChat();

      const response = await fetch('/api/interaction-requests/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId: user.id }),
      });

      console.log('Fetch response:', response); // Debugging log

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const jsonResponse = await response.json(); // Ensuring response is only processed here
      onAccept(jsonResponse.channelId);
      
    } catch (error) {
      console.error('Error accepting interaction request:', error);
    }
  };

  const handleReject = async (senderId) => {
    if (!user) return;

    try {
      await connectUserToChat();

      const response = await fetch('/api/interaction-requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId: user.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const result = await response.json();
      alert('Interaction request rejected');
    } catch (error) {
      console.error('Error rejecting interaction request:', error);
    }
  };

  return (
    <div className="py-2">
      <h2 className="text-lg font-bold px-4 py-2 border-b border-gray-200">Interaction Requests</h2>
      {interactionRequests.length > 0 ? (
        interactionRequests.map((request) => (
          <div key={request.senderId} className="interaction-request px-4 py-2 border-b border-gray-200">
            <p className="text-sm">Request from: {request.senderNickname}</p>
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={() => handleAccept(request.senderId)} 
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button 
                onClick={() => handleReject(request.senderId)} 
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="px-4 py-2">No interaction requests</p>
      )}
    </div>
  );
};

export default InteractionRequests;
