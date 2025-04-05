import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "./components/VideoCall"; // Import VideoCall component

const Room = () => {
  const { roomCode } = useParams(); // Get the room code from the URL

  return (
    <div className="room-container">
      <h2>Room: {roomCode}</h2>
      <VideoCall roomId={roomCode} /> {/* Pass the roomCode to VideoCall */}
    </div>
  );
};

export default Room;
