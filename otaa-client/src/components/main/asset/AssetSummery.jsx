import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Divider, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { Card } from "@mui/material";
import { Cookies } from "react-cookie";
import MUISnackbar from "../../common/snackbar/Snackbar";
import DashboardService from "../../../services/dashboard/dashboard.service";
import AssetService from "../../../services/asset/asset.service";
import "./AssetSummery.css";
import SearchBar from "./SearchBar";

const AssetSummery = () => {
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [xposition, setXposition] = React.useState("right");
  const [yposition, setYposition] = React.useState("bottom");
  const [loading, setLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
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
            navigate(`/detail-dashboard/${params.row.Asset_ID}`);
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
      field: "Asset_ID",
      headerName: "Action",
      width: 120,
      renderCell: renderActionButton,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Vendor_ID",
      headerName: "Manufacturer",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Device_Type",
      headerName: "Device Type",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Product_Name",
      headerName: "Product Name",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Version",
      headerName: "Firmware Version",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Serial_Number",
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
      field: "System_Name",
      headerName: "System Name",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "System_Description",
      headerName: "System Description",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Module_Number",
      headerName: "Module Number",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "CPU_Type",
      headerName: "CPU Type",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Additional_Component",
      headerName: "Additional Component",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Vulnerability_Count",
      headerName: "Vulnerabilitiy Count",
      renderCell: (params) => (
        <a href={`/detail-dashboard/${params.row.Asset_ID}`}>
          {params.row.Vulnerability_Count}
        </a>
      ),
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
        console.log("response is", result.data.data?.assets_summary);
        setAssetDetails(result.data?.data?.assets_summary);
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
    console.log("call back fired");
    setPageNumber(pagenumber);
  };

  const handlePageSizeChange = (pagesize) => {
    setPageSize(pagesize);
  };

  const DeleteAssetsCollection = async () => {
    const response = await AssetService.deleteAssetsCollection();
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
      <SearchBar placeholder="Search..." />
      <Box
        className="box-origin"
        display="grid"
        gridTemplateColumns="repeat(13, 1fr)"
        gridAutoRows="80px"
        gap="15px"
        margin="8px 0"
        backgroundColor="#eaeef1"
      >
        <Box className="box-1">
          <h6>186</h6>
          <h6>Vulnerability</h6>
        </Box>

        <Box className="box-2">
          <h6>186</h6>
          <Divider />
          <h6>Vulnerability</h6>
        </Box>

        <Box className="box-3">
          <h6>186</h6>
          <Divider />
          <h6>Vulnerability</h6>
        </Box>

        <Box className="box-4">
          <h6>186</h6>
          <Divider />
          <h6>Vulnerability</h6>
        </Box>
      </Box>

      <Card className="center" style={{ padding: 15 }}>
        <Box style={{ display: "flex", justifyContent: "right" }}>
          <Stack style={{ marginRight: "1%" }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<DeleteIcon />}
              onClick={DeleteAssetsCollection}
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
        <Box
          className="Datagrid-box"
          sx={{
            height: 500,
            width: "100%",
          }}
        >
          <DataGrid
            getRowId={(r) => r.Asset_ID}
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

export default AssetSummery;
