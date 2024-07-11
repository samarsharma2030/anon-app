"use client"

import React from 'react';
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import { BeatLoader } from "react-spinners";
import UserCard from "../../../components/UserCard";
import InteractionRequests from "../../../components/InteractionRequests";
import ChatComponent from "../../../components/ChatComponent";
import client from "../../../lib/getStream";
import { ref, onValue } from "firebase/database";
import { database } from "../../../../firebase";

const fetchStreamChatToken = async (userId) => {
  try {
    const response = await fetch("/api/stream-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error("Error fetching StreamChat token:", error);
    throw error;
  }
};

const HomePage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [channelId, setChannelId] = useState(null);
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChatMinimized = () => setIsChatMinimized(!isChatMinimized);

  useEffect(() => {
    const connectToChat = async () => {
      if (user && !client.userID) {
        try {
          const token = await fetchStreamChatToken(user.id);
          await client.connectUser({ id: user.id }, token);
          console.log("User connected to StreamChat");
        } catch (error) {
          console.error("Failed to connect the user to StreamChat", error);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      connectToChat();
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      });
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const linkLocationToUserAndFetchNearby = async () => {
      if (location && user) {
        if (isFirstLoad) setIsLoading(true);
        try {
          const linkResponse = await fetch("/api/link-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: location.latitude,
              longitude: location.longitude,
              userId: user.id,
            }),
          });
          if (!linkResponse.ok) {
            const linkResult = await linkResponse.json();
            throw new Error(linkResult.error || "Failed to link location");
          }

          const nearbyResponse = await fetch("/api/nearby-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: location.latitude,
              longitude: location.longitude,
              userId: user.id,
            }),
          });
          if (!nearbyResponse.ok) {
            const nearbyResult = await nearbyResponse.json();
            throw new Error(
              nearbyResult.error || "Failed to fetch nearby users"
            );
          }
          const { users } = await nearbyResponse.json();
          setNearbyUsers(users);
          if (isFirstLoad) setIsFirstLoad(false);
          setIsLoading(false);
        } catch (error) {
          console.error(
            "Error in linking location or fetching nearby users:",
            error
          );
          if (isFirstLoad) setIsFirstLoad(false);
          setIsLoading(false);
        }
      }
    };
    linkLocationToUserAndFetchNearby();
  }, [location, user]);

  const onAcceptHandler = (channelId) => {
    setChannelId(channelId);
    setIsChatConnected(true);
  };

  const handleChatDisconnect = () => {
    setIsChatConnected(false);
  };

  const disconnectChat = () => {
    if (client) {
      client.disconnectUser();
      console.log("User disconnected from StreamChat");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BeatLoader color={"#123abc"} loading={isLoading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onAccept={onAcceptHandler}/>
      <div className="container mx-auto p-4 flex-grow">
        <div className="container mx-auto p-4 flex-grow">
          {nearbyUsers.length > 0 ? (
            <>
              <h2 className="text-xl mb-4">Nearby Users</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nearbyUsers.map((nearbyUser) => (
                  <UserCard
                    key={nearbyUser.id}
                    user={nearbyUser}
                    currentUserId={user.id}
                  />
                ))}
              </div>
            </>
          ) : (
            <div>No users nearby</div>
          )}
        </div>
        {isLoaded && isSignedIn && (
          <div className='w-screen max-w-4xl p-4'>
              <InteractionRequests onAccept={onAcceptHandler} />
          </div>
        )}
        {channelId && isChatConnected && (
          <div
            className={`fixed bottom-0 h-full right-0 w-full sm:w-96 bg-white border border-gray-300 ${
              isChatMinimized ? "h-12" : "h-96"
            }`}
          >
            <div className="flex justify-between items-center bg-gray-100 p-2 border-b border-gray-300">
              <h2 className="text-lg">Chat</h2>
              <button onClick={toggleChatMinimized}>
                {isChatMinimized ? "Maximize" : "Minimize"}
              </button>
            </div>
            {!isChatMinimized && 
              <ChatComponent
                chatChannel={channelId}
                onDisconnect={handleChatDisconnect}
                onConnect={() => setIsChatConnected(true)}
                isMinimized={isChatMinimized}
                onToggleMinimize={toggleChatMinimized}
              />
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
