import React from "react";
import networkServices from "../../../services/network/network.service";
import { Box, Grid, Paper, Stack } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Cookies } from "react-cookie";
import { useParams } from "react-router-dom";

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

const columns = [
  {
    field: "Device_A",
    headerName: "Device A",
    width: 250,
    sortable: false,
  },
  {
    field: "Device_B",
    headerName: "Device B",
    width: 250,
    sortable: false,
  },
  {
    field: "First_Seen_Date",
    headerName: "First Seen Date",
    width: 250,
    sortable: false,
  },
  {
    field: "Last_Seen_Date",
    headerName: "Last Seen Date",
    width: 250,
    sortable: false,
  },
  {
    field: "Total_Bandwidth",
    headerName: "Total Bandwidth",
    width: 250,
    sortable: false,
  },
  { field: "Protocol", headerName: "Protocol", width: 250, sortable: false },
  { field: "Port", headerName: "Port", width: 250, sortable: false },
];

const NetworkDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [totalNetworks, setTotalNetworks] = React.useState(100);
  const [networkStatDetails, setNetworkStatDetils] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const { id } = useParams();

  // To
  const paginationModel = { page: pageNumber, pageSize };

  //getting user data from cookies
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;

  const handlePageChange = (newPageModel) => {
    console.log("call back fired", newPageModel);
    setPageNumber(newPageModel.page);
    setPageSize(newPageModel.pageSize);
  };

  const getNetworkStatDetailsByAssetId = async (
    id,
    userId,
    pageSize,
    pageNumber
  ) => {
    try {
      const response = await networkServices.getNetworkStatByAssetsId({
        id,
        userId,
        pageSize,
        pageNumber,
      });
      console.log("response is", response.data.data);
      setNetworkStatDetils(response.data.data.Network_Summary);
      setTotalNetworks(response.data.data.Total_Count);
    } catch (error) {
      console.log(
        "error occured NetworkDetails.jsx getNetworkStatDetailsByAssetId",
        error
      );
    }
  };

  React.useEffect(() => {
    getNetworkStatDetailsByAssetId(id, userId, pageSize, pageNumber);
  }, [id, userId, pageSize, pageNumber]);

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        height: "60vh",
        width: "100%",
      }}
    >
      <DataGridPro
        getRowId={(row) => row.First_Seen_Date}
        rows={networkStatDetails}
        columns={columns}
        loading={loading}
        paginationMode="server"
        pagination
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 25]}
        rowCount={totalNetworks}
        onPaginationModelChange={handlePageChange}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
      />
    </Box>
  );
};

export default NetworkDetails;
