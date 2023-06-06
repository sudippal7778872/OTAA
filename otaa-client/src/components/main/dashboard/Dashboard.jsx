import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import { Cookies } from "react-cookie";
import Delete from "@mui/icons-material/Delete";
import MUISnackbar from "../../common/snackbar/Snackbar";
import DashboardService from "../../../services/dashboard/dashboard.service";

const Dashboard = () => {
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

  const renderActionButton = (params) => {
    return (
      <strong>
        <InfoIcon
          style={{ marginLeft: 15, marginRight: 15 }}
          type="button"
          color="primary"
          onClick={() => {
            navigate(`/assets/info/${params.row._id}`);
          }}
        />
        <DeleteIcon
          // style={{ marginLeft: 20, color: "#006975" }}
          type="button"
          color="error"
          onClick={() => {
            // navigate(`/delete/${params.row.StudentID}`);
            if (window.confirm("are you sure want to delete this record?"))
              // navigate(`/hops/delete/${params.row.HopPID}`);
              //   HOPService.deleteHOP(params.row._id)
              //     .then((res) => {
              //       setHOPData(res.data);
              //       getHOP();
              //     })
              //     .catch((err) => {
              //       console.log(err.message);
              //     });
              console.log("will delete later");
          }}
        />
      </strong>
    );
  };

  const columns = [
    {
      field: "_id",
      headerName: "Action",
      width: 120,
      renderCell: renderActionButton,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Vendor ID",
      headerName: "Manufacturer",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Device Type",
      headerName: "Device Type",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Product Name",
      headerName: "Product Name",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Firmware Version",
      headerName: "Firmware Version",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Serial Number",
      headerName: "Serial Number",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "IP",
      headerName: "IP",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Mac",
      headerName: "Mac",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "System Name",
      headerName: "System Name",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "System Description",
      headerName: "System Description",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Module Number",
      headerName: "Module Number",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "CPU Type",
      headerName: "CPU Type",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Addtional Component",
      headerName: "Addtional Component",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const getAssetDetails = async (pagesize, pagenumber) => {
    try {
      setLoading(true);
      const result = await DashboardService.getAssetsForDashboard(
        userId,
        pagesize,
        pagenumber
      );
      if (result.data?.data) {
        console.log("response is", result.data);
        setAssetDetails(result.data?.data);
        setTotalAssets(result.data?.total);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("error occured", err);
      setAlertMsg("Something went wrong Please try Again Later");
      setSeverity("error");
      setXposition("center");
      setYposition("top");
      setOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const handlePageChange = (pagenumber) => {
    setPageNumber(pagenumber);

    getAssetDetails(pagenumber, pageSize);
  };
  const handlePageSizeChange = (pagesize) => {
    setPageSize(pagesize);

    getAssetDetails(pageNumber, pagesize);
  };

  React.useEffect(() => {
    getAssetDetails(pageSize, pageNumber);
  }, [pageSize, pageNumber]);
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
            getRowId={(r) => r._id}
            rows={assetDetails}
            columns={columns}
            loading={loading}
            paginationMode="server"
            pageSize={pageSize}
            rowCount={totalAssets}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
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

export default Dashboard;
