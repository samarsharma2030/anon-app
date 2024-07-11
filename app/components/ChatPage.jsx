// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useUser } from '@clerk/nextjs';
// import ChatComponent from '../components/ChatComponent';
// import client from '../lib/getStream';

// const ChatPage = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const [chatChannel, setChatChannel] = useState(null);
//   const [isMinimized, setIsMinimized] = useState(false);

//   useEffect(() => {
//     const { channelId } = router.query;
//     if (channelId) {
//       setChatChannel(channelId);
//     }
//   }, [router.query]);

//   const handleAccept = (channelId) => {
//     setChatChannel(channelId);
//   };

//   const handleToggleMinimize = () => {
//     setIsMinimized((prev) => !prev);
//   };

//   return (
//     <div className="flex">
//       <div className="w-1/4 p-4">
//         <InteractionRequests onAccept={handleAccept} />
//       </div>
//       <div className="w-3/4">
//         {chatChannel && (
//           <ChatComponent
//             chatChannel={chatChannel}
//             onConnect={() => console.log('Connected to chat')}
//             onDisconnect={() => {
//               console.log('Disconnected from chat');
//               setChatChannel(null);
//             }}
//             isMinimized={isMinimized}
//             onToggleMinimize={handleToggleMinimize}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;





// </div>
//         {channelId && isChatConnected && (
//           <div className={`fixed bottom-0 right-0 w-full sm:w-96 bg-white border border-gray-300 ${isChatMinimized ? 'h-12' : 'h-96'}`}>
//             <div className='flex justify-between items-center bg-gray-100 p-2 border-b border-gray-300'>
//               <h2 className='text-lg'>Chat</h2>
//               <button onClick={toggleChatMinimized}>{isChatMinimized ? 'Maximize' : 'Minimize'}</button>
//             </div>
//             {!isChatMinimized && <ChatComponent chatChannel={channelId} onDisconnect={handleChatDisconnect} onConnect={(() => setIsChatConnected(true))} isMinimized={isChatMinimized} onToggleMinimize={toggleChatMinimized}/>}
//             {/* <ChatComponent chatChannel={channelId} onDisconnect={handleChatDisconnect} onConnect={(() => setIsChatConnected(true))} isMinimized={isChatMinimized} onToggleMinimize={toggleChatMinimized}/> */}
//           </div>
//         )}
//       </div>







// <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <div className="container mx-auto p-4 flex-grow">
//         <div className="container mx-auto p-4 flex-grow">
//           {nearbyUsers.length > 0 ? (
//             <>
//               <h2 className="text-xl mb-4">Nearby Users</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {nearbyUsers.map((nearbyUser) => (
//                   <UserCard
//                     key={nearbyUser.id}
//                     user={nearbyUser}
//                     currentUserId={user.id}
//                   />
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div>No users nearby</div>
//           )}
//         </div>
//         <div className="w-screen max-w-4xl p-4">
//           <InteractionRequests onAccept={onAcceptHandler} />
//         </div>
//         {channelId && isChatConnected && (
//           <div
//             className={`fixed bottom-0 right-0 w-full sm:w-96 bg-white border border-gray-300 ${
//               isChatMinimized ? "h-12" : "h-96"
//             }`}
//           >
//             <div className="flex justify-between items-center bg-gray-100 p-2 border-b border-gray-300">
//               <h2 className="text-lg">Chat</h2>
//               <button onClick={toggleChatMinimized}>
//                 {isChatMinimized ? "Maximize" : "Minimize"}
//               </button>
//             </div>
//             {!isChatMinimized && (
//               <ChatComponent
//                 chatChannel={channelId}
//                 onDisconnect={handleChatDisconnect}
//                 onConnect={() => setIsChatConnected(true)}
//                 isMinimized={isChatMinimized}
//                 onToggleMinimize={toggleChatMinimized}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     </div> 
