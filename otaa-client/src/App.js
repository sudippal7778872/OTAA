import React, { Component, createContext, useReducer } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/common/navbar/Navbar";
import ErrorBoundary from "./ErrorBoundary";

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

  return (
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
  );
};

export default App;
