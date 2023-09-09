import React, { Component, createContext, useReducer } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/common/navbar/Navbar";
import ErrorBoundary from "./ErrorBoundary";
// import { LicenseInfo } from "@mui/x-data-grid-pro";
import { ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./pages/theme";

// LicenseInfo.setLicenseKey(
//   "x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e"
// );

export const UserContext = createContext();
export const RoleContext = createContext();

export const initialState = null;

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "ADMIN":
      return action.payload;
    // case 'reset':
    //   return init(action.payload);
    default:
      throw new Error();
  }
}

const App = () => {
  const [login, dispatchLogin] = useReducer(reducer, initialState);
  const [admin, dispatchAdmin] = useReducer(reducer, false);
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      {/* <ThemeProvider theme={theme}> */}
      {/* <CssBaseline /> */}
      <div>
        {/* <ErrorBoundary> */}
        <Router>
          <UserContext.Provider value={{ login, dispatchLogin }}>
            <RoleContext.Provider value={{ admin, dispatchAdmin }}>
              <Navbar />
            </RoleContext.Provider>
          </UserContext.Provider>
        </Router>
        {/* </ErrorBoundary> */}
      </div>
      {/* </ThemeProvider> */}
    </ColorModeContext.Provider>
  );
};

export default App;
