
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material";
import { AuthContextProvider } from './context/AuthContext';

import "./global.css";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "rgba(255,255,255,0.9)",
      disabled: "rgba(218,208,208,0.38)",
      secondary: "rgba(226,218,218,0.6)",
    },
    secondary: {
      main: "rgba(152,74,166,1)",
      dark: "rgba(123,31,162,1)",
      light: "rgba(252,232,255,1)",
    },
    background: { default: "rgba(123,31,162,1)", paper: "rgba(123,31,162,1)" },
  },
  shape: { borderRadius: 4 },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <AuthContextProvider>
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />

      </ThemeProvider>
    </StyledEngineProvider>
  </BrowserRouter>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
