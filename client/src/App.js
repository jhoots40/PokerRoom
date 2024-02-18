import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: {
      main: "#707070",
    },
    secondary: {
      main: "#0277bd",
    },
    customDarkGrey: {
      main: "#141414",
    },
    background: {
      default: "rgb(70, 70, 70)",
    },
  },
  form: {
    width: "100%", // Set the width to 100%
  },
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    customDarkGrey: theme.palette.augmentColor({
      color: {
        main: "#141414",
      },
      name: "customDarkGrey",
    }),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
