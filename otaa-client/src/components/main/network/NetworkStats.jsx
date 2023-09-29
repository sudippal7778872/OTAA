import React, { useEffect, useState } from "react";
import networkServices from "../../../services/network/network.service";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Card,
  Button,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Cookies } from "react-cookie";
import MUISnackbar from "../../common/snackbar/Snackbar";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ImportExportIcon from "@mui/icons-material/ImportExport";

function DetailPanelContent({ row: rowProp }) {
  const columns = [
    { field: "Timestamp", headerName: "Timestamp", width: 250 },
    {
      field: "Source",
      headerName: "Source",
      width: 200,
    },
    {
      field: "to",
      headerName: "Destination",
      width: 200,
    },
    {
      field: "Protocol",
      headerName: "Protocol",
      width: 150,
    },
    {
      field: "Bytes_Exchanged",
      headerName: "Byte Exchange",
      width: 150,
    },
    {
      field: "Higher_Layer_Protocols",
      headerName: "Higher Layer Protocols",
      width: 200,
    },
    {
      field: "Source_Port",
      headerName: "Source Port",
      width: 170,
    },
    {
      field: "to_Port",
      headerName: "Destination Port",
      width: 170,
    },
  ];
  return (
    <Stack
      sx={{ py: 2, height: "100%", boxSizing: "border-box" }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: "auto", width: "90%", p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          {/* <Typography variant="h6">{`Order #${rowProp.id}`}</Typography> */}
          {/* <DataGridPro
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
            autoPageSize={true}
            hideFooter
          /> */}
          <DataGrid
            rows={rowProp.Conversation}
            getRowId={(row) => row.Timestamp}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
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
  { field: "First_Seen_Date", headerName: "First Seen Date", width: 170 },
  { field: "Last_Seen_Date", headerName: "Last Seen Date", width: 170 },
  { field: "Total_Bandwidth", headerName: "Total Bandwidth", width: 150 },
  { field: "Protocol", headerName: "Protocol", width: 150 },
  { field: "Port", headerName: "Port", width: 230 },
];

const NetworkStats = () => {
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [xposition, setXposition] = React.useState("right");
  const [yposition, setYposition] = React.useState("bottom");
  const [networkStatData, setNetworkStatData] = useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [totalNetworks, setTotalNetworks] = React.useState(100);
  const [paginationModel, setPaginationModel] = React.useState({
    pageNumber: 0,
    pageSize: 10,
  });

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
      console.log("response is", response.data.data);
      setNetworkStatData(response.data.data.Network_Summary);
      setTotalNetworks(response.data.data.Total_Count);
    } catch (error) {
      console.log(
        `Error Occured in NetworkStats getNetworkStatDataByUserId ${error}`
      );
    }
  };

  const deleteNetworksCollection = async () => {
    const response = await networkServices.deleteNetworksCollection();
    if (response.status == 200) {
      setAlertMsg("Deleted Successfully");
      setSeverity("success");
      setOpen(true);
    } else {
      setAlertMsg("Some error occured");
      setSeverity("error");
      setOpen(true);
    }
  };

  useEffect(() => {
    getNetworkStatDataByUserId(userId, pageSize, pageNumber);
  }, [pageNumber, pageSize]);

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  const handleCloseSnackbar = () => {
    setOpen(false);
  };
  //page number change
  const handlePageChange = (newPageModel) => {
    console.log("call back fired", newPageModel);
    setPageNumber(newPageModel.page);
    setPageSize(newPageModel.pageSize);
  };

  const paginationModel2 = { pageSize, pageNumber };
  return (
    <>
      <MUISnackbar
        open={open}
        handleClose={handleCloseSnackbar}
        alertMsg={alertMsg}
        severity={severity}
        xposition={xposition}
        yposition={yposition}
      />
      <Card className="center" style={{ padding: 15 }}>
        <Box style={{ display: "flex", justifyContent: "right" }}>
          <Stack style={{ marginRight: "1%" }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<DeleteIcon />}
              onClick={deleteNetworksCollection}
            >
              Delete Assets Collection
            </Button>
          </Stack>
          <Stack>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ImportExportIcon />}
            >
              Export
            </Button>
          </Stack>
        </Box>

        <br />
        <Box sx={{ width: "100%", height: "80vh" }}>
          <DataGridPro
            getRowId={(row) => row.First_Seen_Date}
            columns={columns}
            rows={networkStatData}
            loading={loading}
            paginationMode="server"
            pagination
            paginationModel={paginationModel}
            pageSizeOptions={[5, 10, 25]}
            rowCount={totalNetworks}
            onPaginationModelChange={handlePageChange}
            getDetailPanelHeight={getDetailPanelHeight}
            getDetailPanelContent={getDetailPanelContent}
          />
        </Box>
      </Card>
    </>
  );
};

export default NetworkStats;
