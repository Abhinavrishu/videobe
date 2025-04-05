import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Chat,JoinRoom } from "./AdditionalPages";
import LandingPage from "./landing"; // Your landing page component
import Room from "./room"
function App() {
  return (
 
    <Router>
     
    
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/join-room" element={<JoinRoom />} />
      </Routes>
      </Router>
    
    
  );
}

export default App;
