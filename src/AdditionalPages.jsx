import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomCode.trim() === "") {
      alert("Please enter a valid room code");
      return;
    }

    navigate(`/room/${roomCode}`);
    // 🚫 DO NOT emit socket.join here, it's handled in VideoCall.js after media is ready
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Join a Video Call Room</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Enter Room Code"
        style={styles.input}
      />
      <button onClick={handleJoin} style={styles.button}>
        Join Room
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "1rem",
    background: "#f7f7f7",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const Chat = () => {
  return <div>HI</div>; // Just a placeholder for your chat component
};

export { Chat, JoinRoom };
