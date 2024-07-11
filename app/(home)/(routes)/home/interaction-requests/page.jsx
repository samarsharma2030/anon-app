// app/home/interaction-requests/page.jsx
import { useEffect, useState } from 'react';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import { useUser } from '@clerk/nextjs';

const InteractionRequestsPage = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const requestsRef = ref(database, `interactionRequests`);
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const userRequests = Object.values(data || {}).filter(
        (request) => request.receiverId === user.id && request.status === 'pending'
      );
      setRequests(userRequests);
    });
  }, [user]);

  const handleRequest = async (request, action) => {
    try {
      const endpoint = action === 'accept' ? 'accept' : 'reject';
      const response = await fetch(`/api/interaction-requests/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: request.senderId,
          receiverId: request.receiverId,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  return (
    <div>
      <h1>Interaction Requests</h1>
      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        requests.map((request) => (
          <div key={`${request.senderId}_${request.receiverId}`} className="border p-2 mb-2">
            <p>Request from User ID: {request.senderId}</p>
            <button onClick={() => handleRequest(request, 'accept')} className="bg-green-500 text-white p-2 mr-2 rounded">
              Accept
            </button>
            <button onClick={() => handleRequest(request, 'reject')} className="bg-red-500 text-white p-2 rounded">
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default InteractionRequestsPage;
