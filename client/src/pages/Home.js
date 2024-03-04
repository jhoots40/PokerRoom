import React from "react";
import { Button, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { isLoading, isError, error } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/userInfo/",
          {
            withCredentials: true,
          }
        );
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
    if (user) {
      console.log(user);
    }
  }, [user]);

  const handleJoin = () => {};

  const handleRooms = () => {
    navigate("/rooms");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

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
      <Button sx={{ m: 0.5 }} variant="contained" color="customDarkGrey">
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
