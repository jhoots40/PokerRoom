import React from "react";
import { Box, Button, Grid, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.onmessage = (e) => {
      console.log(JSON.parse(e.data));
    };
  }, []);

  const handleClick = () => {
    console.log("clicked");
    try {
      socket.send(JSON.stringify({ message: "clicked button" }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoin = () => {
    navigate("/join");
  };

  const handleRooms = () => {
    navigate("/rooms");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", backgroundColor: "rgb(70, 70, 70)" }}
    >
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            sx={{
              bgcolor: "#0277bd",
              borderColor: "#141414 !important",
              border: 5,
              width: 100,
              height: 100,
            }}
          >{`${user?.username}`}</Avatar>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={handleRooms}
          >
            Active Rooms
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={handleClick}
          >
            Create
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={handleJoin}
          >
            Join Room
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
