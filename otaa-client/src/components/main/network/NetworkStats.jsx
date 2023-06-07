import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card } from "@mui/material";

import { Cookies } from "react-cookie";
import MUISnackbar from "../../common/snackbar/Snackbar";

const NetworkStats = () => {
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [xposition, setXposition] = React.useState("right");
  const [yposition, setYposition] = React.useState("bottom");
  const [loading, setLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [assetDetails, setAssetDetails] = React.useState([]);
  const [totalAssets, setTotalAssets] = React.useState(0);
  const navigate = useNavigate();

  //userId
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;

  const columns = [
    {
      field: "SourceAddress",
      headerName: "Source Address",
      width: 200,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "DestinationAddress",
      headerName: "Destination Address",
      width: 200,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Protocol",
      headerName: "Protocol",
      width: 200,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Bytes",
      headerName: "KiloBytes",
      width: 200,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const rows = [
    {
      SourceAddress: "10.113.218.2",
      DestinationAddress: "224.0.0.102",
      Protocol: "HSRPv2",
      Bytes: Math.round(4560 / 1024),
    },
    {
      SourceAddress: "10.113.218.43",
      DestinationAddress: "10.113.218.91",
      Protocol: "CIP/ENIP",
      Bytes: Math.round(33246 / 1024),
    },
    {
      SourceAddress: "10.113.218.43",
      DestinationAddress: "10.113.218.201",
      Protocol: "CIP/ENIP",
      Bytes: Math.round(668 / 1024),
    },
    {
      SourceAddress: "10.113.218.43",
      DestinationAddress: "239.255.255.250",
      Protocol: "SSDP",
      Bytes: Math.round(9324 / 1024),
    },
    {
      SourceAddress: "10.113.218.53",
      DestinationAddress: "10.113.218.201",
      Protocol: "ENIP",
      Bytes: Math.round(736 / 1024),
    },
    {
      SourceAddress: "10.113.218.61",
      DestinationAddress: "10.113.218.201",
      Protocol: "ENIP",
      Bytes: Math.round(448 / 1024),
    },
    {
      SourceAddress: "10.113.218.91",
      DestinationAddress: "10.113.218.53",
      Protocol: "CIP I/O",
      Bytes: 680954 / 1024,
    },
    {
      SourceAddress: "10.113.218.91",
      DestinationAddress: "10.113.218.61",
      Protocol: "CIP I/O",
      Bytes: Math.round(321372 / 1024),
    },
    {
      SourceAddress: "10.113.218.91",
      DestinationAddress: "10.113.218.105",
      Protocol: "CIP I/O",
      Bytes: Math.round(4538 / 1024),
    },
    {
      SourceAddress: "10.113.218.91",
      DestinationAddress: "10.113.218.201",
      Protocol: "CIP CM",
      Bytes: Math.round(24768 / 1024),
    },
    {
      SourceAddress: "10.113.218.105",
      DestinationAddress: "10.113.218.201",
      Protocol: "ENIP",
      Bytes: Math.round(264 / 1024),
    },
    {
      SourceAddress: "10.113.218.201",
      DestinationAddress: "255.255.255.255",
      Protocol: "ENIP",
      Bytes: Math.round(990 / 1024),
    },
    {
      SourceAddress: "84.27.15.200",
      DestinationAddress: "239.255.255.250",
      Protocol: "SSDP",
      Bytes: Math.round(3456 / 1024),
    },
    {
      SourceAddress: "84.27.15.200",
      DestinationAddress: "84.255.255.255",
      Protocol: "SSDP",
      Bytes: Math.round(276 / 1024),
    },
    {
      SourceAddress: "192.168.1.176",
      DestinationAddress: "192.168.1.56",
      Protocol: "MODBUS/TCP",
      Bytes: Math.round(2581 / 1024),
    },
    {
      SourceAddress: "192.168.1.176",
      DestinationAddress: "224.0.0.252",
      Protocol: "LLMNR",
      Bytes: Math.round(140 / 1024),
    },
    {
      SourceAddress: "192.168.10.201",
      DestinationAddress: "192.168.10.1",
      Protocol: "S7COMM/COTP",
      Bytes: Math.round(96701 / 1024),
    },
    {
      SourceAddress: "192.168.10.201",
      DestinationAddress: "239.255.255.250",
      Protocol: "SSDP",
      Bytes: Math.round(1901 / 1024),
    },
    {
      SourceAddress: "10.113.218.207",
      DestinationAddress: "10.113.218.27",
      Protocol: "BACnet",
      Bytes: Math.round(1330 / 1024),
    },
  ];

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

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
        <br />
        <Box
          sx={{
            height: 500,
            width: "100%",
          }}
        >
          <DataGrid
            getRowId={(r) => r.Bytes}
            rows={rows}
            columns={columns}
            loading={loading}
            paginationMode="server"
            // pageSize={pageSize}
            // rowCount={totalAssets}
            // onPageChange={handlePageChange}
            // onPageSizeChange={handlePageSizeChange}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
          />
          <br />
          <br />
          <br />
        </Box>
      </Card>
    </>
  );
};

export default NetworkStats;
