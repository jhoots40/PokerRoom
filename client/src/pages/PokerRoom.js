import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PokerRoom.css";
import ChatBox from "../components/ChatBox";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";

function PokerRoom() {
  const [socket, setSocket] = useState(null);
  const { entry_code } = useParams();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [user, setUser] = useState(null);

  useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/userInfo/",
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setUser(response.data);
        return response.data; // Make sure to return data
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Unauthorized");
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
        throw new Error(error); // Rethrow the error
      }
    },
    refetchOnWindowFocus: false,
  });

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

    const messageListener = (event) => {
      const data = JSON.parse(event.data);
      console.log(user);
      console.log(data);
      // Generate a unique key for the message
      const messageKey = new Date().toISOString(); // You can use a more sophisticated method if needed

      // Update the state to include the new message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          key: messageKey,
          username: data.username,
          message: data.message,
          mine: data.username === user.username,
        },
      ]);
    };

    const openListener = (event) => {
      console.log("WebSocket connected");
    };

    // Listen for messages
    socket.addEventListener("message", messageListener);

    // Connection opened
    socket.addEventListener("open", openListener);

    return () => {
      socket.removeEventListener("message", messageListener);
      socket.removeEventListener("open", openListener);
    };
  }, [socket, user]);

  useEffect(() => {
    if (chatMessages.length === 0) return;
    console.log(chatMessages);
  }, [chatMessages]);

  return (
    <div className="container">
      <div className="poker-table">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          Leave
        </Button>
      </div>
      <div className="chat-box">
        <ChatBox chatMessages={chatMessages} socket={socket} />
      </div>
      <div className="action-box"></div>
    </div>
  );
}

export default PokerRoom;
