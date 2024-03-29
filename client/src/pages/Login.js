import React, { useState } from "react";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import { Grid, Button, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // const data = {
    //   username: username,
    //   password: password,
    // };
    const response = axios
      .post(
        "http://localhost:8000/auth/login/",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true, // Include credentials in the request
        }
      )
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error.response.data.error);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
      sx={{ backgroundColor: "rgb(70, 70, 70)" }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h1" color="#141414">
              Jake's Poker Room
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 2 }}>
            <Typography variant="span" color="#141414">
              Don't have an account?&ensp;
            </Typography>
            <Link href="/register" color="secondary" variant="span">
              Sign up today!
            </Link>
          </Grid>
          {error && (
            <Grid item>
              <Typography variant="p" color="error">
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              error={error !== ""}
              focused
              color="customDarkGrey"
            />
          </Grid>
          <Grid item>
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error !== ""}
              focused
              color="customDarkGrey"
            />
          </Grid>
          <Grid item sx={{ mt: 1 }}>
            <Button
              sx={{ margin: 0.5 }}
              type="submit"
              variant="contained"
              color="customDarkGrey"
            >
              Log In
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Login;
