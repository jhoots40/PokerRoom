import React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, TextField, Paper, useTheme } from "@mui/material";
import MessageBubble from "./MessageBubble";

const ChatBox = ({ chatMessages, socket }) => {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const containerRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() === "") return;
    // Send message to server
    socket.send(
      JSON.stringify({ type: "chat_message", message: `${message}` })
    );
    setMessage("");
  };

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [chatMessages]);

  return (
    <form onSubmit={handleSubmit}>
      <Paper
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: theme.palette.customDarkGrey.main,
          padding: "15px",
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          alignItems="center"
          sx={{
            height: "100%",
          }}
        >
          <Grid
            item
            container
            direction="column"
            justifyContent="flex-start"
            sx={{
              maxHeight: `calc(100% - 42px)`,
              overflowY: "auto",
              flexWrap: "nowrap", // Add this line
            }}
            ref={containerRef}
          >
            {chatMessages.map((m) => (
              <Grid item container key={m.key}>
                <MessageBubble message={m} />
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            container
            sx={{ pt: "6px" }}
            display="row"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              id="message"
              variant="outlined"
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
              error={false}
              value={message}
              focused
              color="primary"
              size="small"
              sx={{
                width: "100%",
                "& input": { color: "white", fontSize: 13 },
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default ChatBox;
