import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import networkServices from "../../../services/network/network.service";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { useParams } from "react-router-dom";
// import Graph from "../network/Graph";

const NetworkGraphDetails = () => {
  const [graphData, setGraphData] = useState({});
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;
  const { id } = useParams();

  useEffect(() => {
    // Create a data set for nodes and edges
    // const nodes = new DataSet([
    //   { id: 1, label: "Node 1" },
    //   { id: 2, label: "Node 2" },
    //   { id: 3, label: "Node 3" },
    // ]);

    // const edges = new DataSet([
    //   { from: 1, to: 2 },
    //   { from: 2, to: 3 },
    // ]);
    // getNetworkGraphByUserId(userId);

    let network;
    // Create a div to render the network
    const container = document.getElementById("network-container");

    // Define the network options
    const options = {
      nodes: {
        shape: "circle",
      },
      edges: {
        arrows: "to",
      },
    };

    networkServices
      .getNetworkGraphByAssetsId({ id, userId, pageNumber: 0, pageSize: 20 })
      .then((res) => {
        console.log("respose", res.data);
        const data = res.data?.data[0]?.Network_Graph;
        console.log("node is", data.nodes);
        data?.edges.forEach((el) => {
          let obj = {};
          if (el.to != data.nodes[0].id) {
            obj.id = el.to;
            obj.label = el.to;
          }
          data?.nodes.push(obj);
        });
        console.log("new node is", data.nodes);
        const nodes = new DataSet(data?.nodes);
        const edges = new DataSet(data?.edges);

        // Create the network
        network = new Network(container, { nodes, edges }, options);
      })
      .catch((err) => {
        console.log(`Error Occured in Graph.js`, err);
      });
  }, [userId]);

  return (
    <div>
      <h2>Network Graph for assets</h2>
      <div
        id="network-container"
        style={{ width: "100%", height: "60vh", background: "lightgray" }}
      ></div>
    </div>
  );
};

export default NetworkGraphDetails;
