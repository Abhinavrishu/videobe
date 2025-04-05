import React, { useState } from "react";
import { useSocket } from "./providers/socket";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const { socket } = useSocket();
  const [email, setEmail] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!email || !roomCode) {
      alert("Please enter both Email and Room Code.");
      return;
    }

    socket.emit("join", { roomId: roomCode });
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Join a Room</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter room code"
          className="w-full p-2 border rounded mb-3"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;


const Chat = () => {
  return <div>HI</div>; // Just a placeholder for your chat component
};

export { Chat, JoinRoom };
