import React from 'react';
import { useUser } from '@clerk/nextjs';

const UserCard = ({ user }) => {
  const { user: currentUser } = useUser();

  const sendInteractionRequest = async () => {
    try {
      const response = await fetch('/api/interaction-requests/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: user.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Interaction request sent');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending interaction request:', error);
    }
  };

  if (!user || !user.publicMetadata) {
    console.error('Invalid user data:', user);
    return null; 
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white hover:bg-red-100">
      <h2 className="text-lg font-bold mb-2 uppercase">{user.publicMetadata.nickname}</h2>
      <button onClick={sendInteractionRequest} className="bg-blue-500 text-white p-2 rounded">
        Send Interaction Request
      </button>
    </div>
  );
};

export default UserCard;
