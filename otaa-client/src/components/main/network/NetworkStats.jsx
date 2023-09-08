import React, { useEffect, useState } from "react";
import networkServices from "../../../services/network/network.service";
import { Box, Grid, Typography, Paper, Stack } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Cookies } from "react-cookie";

function DetailPanelContent({ row: rowProp }) {
  return (
    <Stack
      sx={{ py: 2, height: "100%", boxSizing: "border-box" }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: "auto", width: "90%", p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          {/* <Typography variant="h6">{`Order #${rowProp.id}`}</Typography> */}
          <DataGridPro
            density="compact"
            columns={[
              { field: "Timestamp", headerName: "Timestamp", width: 250 },
              {
                field: "Source",
                headerName: "Source",
                width: 180,
              },
              {
                field: "Destination",
                headerName: "Destination",
                width: 180,
              },
              {
                field: "Protocol",
                headerName: "Protocol",
                width: 150,
              },
              {
                field: "Source_Port",
                headerName: "Source Port",
                width: 130,
              },
              {
                field: "Destination_Port",
                headerName: "Destination Port",
                width: 150,
              },
            ]}
            rows={rowProp.Conversation}
            getRowId={(row) => row.Timestamp}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

//columns
const columns = [
  { field: "Device_A", headerName: "Device A", width: 200 },
  { field: "Device_B", headerName: "Device B", width: 200 },
  { field: "First_Seen_Date", headerName: "First Seen Date", width: 150 },
  { field: "Last_Seen_Date", headerName: "Last Seen Date", width: 150 },
  { field: "Total_Bandwidth", headerName: "Total Bandwidth", width: 150 },
  { field: "Protocol", headerName: "Protocol", width: 150 },
  { field: "Port", headerName: "Port", width: 150 },
];

const NetworkStats = () => {
  const [networkStatData, setNetworkStatData] = useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [loading, setLoading] = React.useState(false);
  const [totalAssets, setTotalAssets] = React.useState(100);

  //getting user data from cookies
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;

  const getNetworkStatDataByUserId = async (userId, pageSize, pageNumber) => {
    try {
      const response = await networkServices.getAllNetworkStatByUserId(
        userId,
        pageSize,
        pageNumber
      );
      console.log("response is", response.data.data[0].Network_Summary);
      setNetworkStatData(response.data.data[0].Network_Summary);
    } catch (error) {
      console.log(
        `Error Occured in NetworkStats getNetworkStatDataByUserId ${error}`
      );
    }
  };

  useEffect(() => {
    getNetworkStatDataByUserId(userId, pageSize, pageNumber);
  }, [pageSize, pageNumber]);

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  const handlePageChange = (pagenumber) => {
    setPageNumber(pagenumber);
    getNetworkStatDataByUserId(pagenumber, pageSize);
  };

  const handlePageSizeChange = (pagesize) => {
    setPageSize(pagesize);
    getNetworkStatDataByUserId(pageNumber, pagesize);
  };

  return (
    <>
      <Box sx={{ width: "100%", height: 400 }}>
        <DataGridPro
          getRowId={(row) => row._id}
          columns={columns}
          rows={networkStatData}
          loading={loading}
          paginationMode="server"
          pageSize={pageSize}
          rowCount={totalAssets}
          rowThreshold={0}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </Box>
    </>
  );
};

export default NetworkStats;
