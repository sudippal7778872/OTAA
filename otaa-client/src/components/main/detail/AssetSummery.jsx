import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import "../asset/Asset.css";
import assetService from "../../../services/asset/asset.service";

import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";

const AssetSummery = () => {
  const { id } = useParams();
  const [assetDetails, setAssetDetails] = useState([]);

  // Fetch details of the selected asset
  const getAssetSummary = async () => {
    try {
      const result = await assetService.getAssetById(id);
      if (result.data?.data) {
        setAssetDetails(result.data?.data);
      }
    } catch (err) {
      console.log("error occurred", err);
    }
  };

  useEffect((id) => {
    getAssetSummary(id);
  }, []);

  const paragraphStyle = {
    // your paragraph styles here
    color: "rgba(64, 64, 64, 0.5)",
    fontWeight: "bold",
    fontSize: "1.6rem",
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={8} columnSpacing={5}>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>Vendor ID</p>
              <h3>{assetDetails["Vendor ID"]}</h3>
            </section>
          </Grid>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>Device Type</p>
              <h3>{assetDetails["Device Type"]}</h3>
            </section>
          </Grid>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>Product Name</p>
              <h3>{assetDetails["Product Name"]}</h3>
            </section>
          </Grid>

          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>Version</p>
              <h3>{assetDetails.Version}</h3>
            </section>
          </Grid>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>IP Address</p>
              <h3>{assetDetails.IP}</h3>
            </section>
          </Grid>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>Serial Number</p>
              <h3>{assetDetails["Serial Number"]}</h3>
            </section>
          </Grid>

          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>MAC Address</p>
              <h3>{assetDetails.Mac}</h3>
            </section>
          </Grid>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>System Name</p>
              <h3>{assetDetails["System Name"]}</h3>
            </section>
          </Grid>
          <Grid item xs={4}>
            <section style={{ height: "6rem" }}>
              <p style={paragraphStyle}>System Description</p>
              <h3>{assetDetails["System Description"]}</h3>
            </section>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AssetSummery;
