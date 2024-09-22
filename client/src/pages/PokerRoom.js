import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PokerRoom.css";
import ChatBox from "../components/ChatBox";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button, Box } from "@mui/material";
import PokerSeat from "../components/PokerSeat";

const seats = [
  { id: 0, top: "75%", left: "50%" },
  { id: 1, top: "65%", left: "85%" },
  { id: 2, top: "20%", left: "85%" },
  { id: 3, top: "10%", left: "50%" },
  { id: 4, top: "20%", left: "15%" },
  { id: 5, top: "65%", left: "15%" },
];

function PokerRoom() {
  const [socket, setSocket] = useState(null);
  const { entry_code } = useParams();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);

  const { isFetching } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/userInfo/",
          {
            withCredentials: true,
          }
        );
        console.log("Loaded user info", response.data);
        setUser(response.data);
        return response.data; // Make sure to return data
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Unauthorized");
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
        return new Error(error); // Rethrow the error
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log("myVariable changed:", roomInfo);
  }, [roomInfo]);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    if (isFetching || user == null) return;
    const websocketURL = `ws://localhost:8000/ws/chat/${entry_code}/?username=${encodeURIComponent(
      user.username
    )}`;
    const newSocket = new WebSocket(websocketURL);
    if (newSocket) setSocket(newSocket);

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      newSocket.close();
    };
  }, [entry_code, isFetching]);

  useEffect(() => {
    if (!socket) return;

    const messageListener = (event) => {
      const data = JSON.parse(event.data);
      // Generate a unique key for the message
      const messageKey = new Date().toISOString(); // You can use a more sophisticated method if needed

      // Update the state to include the new message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          key: messageKey,
          username: data.username,
          message: data.gameUpdate,
          mine: data.username === user.username,
        },
      ]);
    };

    const openListener = (event) => {
      console.log("WebSocket connected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      navigate("/rooms");
    };

    // Listen for messages
    socket.addEventListener("message", function (event) {
      var messageData = JSON.parse(event.data);
      if (messageData.type === "chat_message") {
        // Handle chat message
        console.log("Received message update:", messageData);
        messageListener(event);
      } else if (messageData.type === "game_update") {
        // Handle game update message
        console.log("Received game update:", messageData);
        setRoomInfo(messageData.roomInfo);
      } else if (messageData.type === "room_update") {
        console.log("Received room update:", messageData);
        setRoomInfo(messageData.roomInfo);
      } else if (messageData.type === "ready_update") {
        console.log("Received ready update:", messageData);
        setRoomInfo(messageData.roomInfo);
      }
    });

    // Connection opened
    socket.addEventListener("open", openListener);

    return () => {
      socket.removeEventListener("message", messageListener);
      socket.removeEventListener("open", openListener);
    };
  }, [socket, user]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  const renderSeats = () => {
    var players = roomInfo?.players;
    return seats.map((s) => {
      return (
        <Box
          key={s.id}
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            transform: "translate(-50%, -50%)",
            top: s.top,
            left: s.left,
          }}
        >
          <PokerSeat player={players?.[s.id]} />
        </Box>
      );
    });
  };

  return (
    <div className="container">
      {renderSeats()}
      <div className="poker-table">
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            await socket.close();
            navigate("/rooms");
          }}
        >
          Leave
        </Button>
        {!roomInfo?.allPlayersReady && (
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              socket.send(JSON.stringify({ type: "ready" }));
            }}
          >
            Ready?
          </Button>
        )}
      </div>
      <div className="chat-box">
        <ChatBox chatMessages={chatMessages} socket={socket} />
      </div>
      <div className="action-box"></div>
    </div>
  );
}

export default PokerRoom;
