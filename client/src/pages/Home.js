import React from "react";
import { Button, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import "./Home.css";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const config = {
      withCredentials: true,
      signal,
    };

    axios
      .get("http://localhost:8000/auth/userInfo/", config)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          console.log("Unauthorized");
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const handleClick = () => {
    console.log("clicked");
    try {
      socket.send(JSON.stringify({ message: "clicked button" }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoin = () => {
    setUser("testing");
  };

  const handleRooms = () => {
    navigate("/rooms");
  };

  return (
    <div className="main-container">
      <Avatar
        sx={{
          bgcolor: "#0277bd",
          borderColor: "#141414 !important",
          border: 5,
          width: 100,
          height: 100,
          p: 0.5,
        }}
      >{`${user?.username}`}</Avatar>
      <Button
        sx={{ m: 0.5 }}
        variant="contained"
        color="customDarkGrey"
        onClick={handleRooms}
      >
        Active Rooms
      </Button>
      <Button
        sx={{ m: 0.5 }}
        variant="contained"
        color="customDarkGrey"
        onClick={handleClick}
      >
        Create
      </Button>
      <Button
        sx={{ m: 0.5 }}
        variant="contained"
        color="customDarkGrey"
        onClick={handleJoin}
      >
        Join Room
      </Button>
    </div>
  );
}

export default Home;
