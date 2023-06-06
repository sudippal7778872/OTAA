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
          <h6>
            It ensures that the transfer of ownership for infrastructure and
            applications between Project and RUN (BAU) is formally managed with
            clear handover and acceptance of accountability It ensures that
            projects have a clear understanding of what artefacts, deliverables,
            and approvals are required to handover infrastructure and
            applications. The aim of this process is to enable Project Managers
            to understand what is required by both Operational RUN and
            Cross-Functional Teams so that the project can be taken into BAU.
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Home;
