import React from "react";
import { useParams } from "react-router-dom";
import networkServices from "../../../services/network/network.service";
import { Cookies } from "react-cookie";

const NetworkDetails = () => {
  const [networlStatDetails, setNetworkStatDetils] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const { id } = useParams();
  //userId
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;

  const getNetworkStatDetailsByAssetId = async () => {
    try {
      const response = await networkServices.getNetworkStatByAssetsId({
        id,
        userId,
        pageSize,
        pageNumber,
      });
    } catch (error) {
      console.log(
        "error occured NetworkDetails.jsx getNetworkStatDetailsByAssetId",
        error
      );
    }
  };

  React.useEffect(() => {
    getNetworkStatDetailsByAssetId();
  }, []);
  return <div>NetworkDetails</div>;
};

export default NetworkDetails;
