import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./PokerRoom.css";
import ChatBox from "../components/ChatBox";

function PokerRoom() {
  const [socket, setSocket] = useState(null);
  const { entry_code } = useParams();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    const websocketURL = `ws://localhost:8000/ws/chat/${entry_code}/`; // Replace with your WebSocket server URL
    const newSocket = new WebSocket(websocketURL);
    setSocket(newSocket);

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      newSocket.close();
    };
  }, [entry_code]);

  useEffect(() => {
    if (!socket) return;

    // Listen for messages
    socket.addEventListener("message", function (event) {
      const message = JSON.parse(event.data);
      console.log("Message from server:", message);
      // Handle the message as needed
    });

    // Connection opened
    socket.addEventListener("open", function (event) {
      console.log("WebSocket connected");
    });
  }, [socket]);

  // Sending data to the server
  const sendMessage = (message) => {
    if (!socket) return;
    const data = {
      message: message,
    };
    socket.send(JSON.stringify(data));
  };

  return (
    <div className="container">
      <div className="poker-table"></div>
      <div className="chat-box">
        <ChatBox chatMessages={chatMessages} />
      </div>
      <div className="action-box"></div>
    </div>
  );
}

export default PokerRoom;
