import React from "react";
import { useEffect } from "react";
import { Box, Avatar, Paper, useTheme, Grid, Typography } from "@mui/material";
import Card from "./Card";

const PokerSeat = ({ player }) => {
  if (player) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0, // Set top to 0 to make the top of the box touch the top of the container
            left: 0,
            //transform: "translate(50%, 0%)", // Center the box horizontally
            border: player.ready ? `5px solid green` : `5px solid black`,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "70%",
              height: "70%",
              top: 0, // Set top to 0 to make the top of the box touch the top of the container
              left: "50%",
              transform: "translateX(-50%)", // Center the box horizontally
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
                bgcolor: "#0277bd",
                color: "white",
              }}
            >
              {null}
            </Avatar>
          </div>
          <Paper
            sx={{
              position: "absolute",
              height: "40%",
              width: "100%",
              top: "60%", // Adjusted to position the box 70% away from the top of the outer box
              zIndex: 3,
              backgroundColor: "#141414",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <>
              <Typography color={"white"} sx={{ fontWeight: "bold" }}>
                {player.username}
              </Typography>
              <Typography color={"white"}>{player.stack}</Typography>
            </>
          </Paper>
        </div>
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            width: "15%",
            height: "15%",
            transform: "translateX(-50%)", // Center the box horizontally
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {player?.hole_cards /*player?.bet == 0 ? "" : player.bet*/}
        </div>
        <div
          style={{
            position: "absolute",
            height: "62.85%",
            width: "45%",
            bottom: "15%", // Adjusted to raise the box more in the middle
            left: "5%", // Adjusted to position the box to the left
            zIndex: 2,
            transform: "rotate(-3deg)", // Applied rotation for a slight tilt
            overFlow: "hidden",
          }}
        >
          {player.hole_cards && (
            <Card card={player.hole_cards.substring(1, 3)} />
          )}
        </div>
        <div
          style={{
            position: "absolute",
            height: "62.85%",
            width: "45%",
            bottom: "15%", // Adjusted to raise the box more in the middle
            right: "5%", // Adjusted to position the box to the right
            zIndex: 2,
            transform: "rotate(3deg)", // Applied rotation for a slight tilt
          }}
        >
          {player.hole_cards && (
            <Card card={player.hole_cards.substring(5, 7)} />
          )}
        </div>
      </>
    );
  }

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
