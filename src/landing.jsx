import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/join-room"); // Directly go to the room
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 relative">
      <h1 className="text-4xl font-extrabold absolute top-6 left-6 text-purple-400">e-mood</h1>

      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h2 className="text-3xl font-bold text-purple-300">WELCOME TO e-mood</h2>
        <p className="text-lg mt-4 text-gray-300">
          Feeling overwhelmed with assignments, career choices, and classwork?
          Let e-mood be your consultant to fix your mood.
        </p>

        <button
          onClick={handleButtonClick}
          className="mt-6 w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          TRY
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
