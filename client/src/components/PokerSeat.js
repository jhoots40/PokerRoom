import React from "react";
import { useEffect } from "react";
import { Box, Avatar, Paper, useTheme, Grid, Typography } from "@mui/material";
//import PlayingCard from "./PlayingCard";

const PokerSeat = ({ name }) => {
  if (name)
    return (
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0, // Set top to 0 to make the top of the box touch the top of the container
          left: 0,
          //transform: "translate(50%, 0%)", // Center the box horizontally
          //border: `2px solid green`,
          zIndex: 1,
        }}
      >
        <Avatar
          sx={{
            position: "relative",
            top: 0,
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: `${name ? "#0277bd" : ""}`,
            color: "white",
          }}
        >
          {name}
        </Avatar>
      </Box>
    );

  return (
    <Avatar
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "50%",
        height: "50%",
        color: "white",
        transform: "translate(50%, 50%)",
      }}
    >
      empty
    </Avatar>
  );
};

export default PokerSeat;
