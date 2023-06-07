import { Typography } from "@mui/material";
import React from "react";
import "./Home.css";
import Divider from "@mui/material/Divider";

const Home = () => {
  return (
    <div>
      <div className="Home">
        <h1>
          <b>OT Asset Analyzer</b>
        </h1>
        <br />
        <Divider></Divider>
        <div className="content">
          <h6>"Let's Demystify the challenge of OT visibility"</h6>
        </div>
      </div>
    </div>
  );
};

export default Home;
