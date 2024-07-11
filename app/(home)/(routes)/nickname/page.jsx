// nickname/page.jsx
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
const NicknamePage = () => {
  const { user } = useUser();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleNicknameSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname,
          userId: user.id
        })
      });
      const result = await response.json();
      if (response.ok) {
        user.reload();
        router.push("/home");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error setting nickname:", error);
      setError("Error setting nickname");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleNicknameSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Set Nickname
        </button>
      </form>
    </div>
  );
};
export default NicknamePage;