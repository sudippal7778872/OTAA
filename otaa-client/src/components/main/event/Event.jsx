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
import eventService from "../../../services/event/event.service";

const Event = () => {
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [xposition, setXposition] = React.useState("right");
  const [yposition, setYposition] = React.useState("bottom");
  const [loading, setLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [eventDetails, setEventDetails] = React.useState(25);
  const [totalEvents, setTotalEvents] = React.useState(0);
  const navigate = useNavigate();

  //userId
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const handlePageChange = (pagenumber) => {
    setPageNumber(pagenumber);
    // getAssetDetails(pagenumber, pageSize);
  };

  const handlePageSizeChange = (pagesize) => {
    setPageSize(pagesize);
    // getAssetDetails(pageNumber, pagesize);
  };

  const getAllEventsById = async (pageSize, pageNumber) => {
    try {
      const response = await eventService.getEventsByUserId(
        userId,
        pageSize,
        pageNumber
      );
      console.log("response", response.data.data[0].events);
      setEventDetails(response.data.data[0].events);
      setTotalEvents(response.data.data[0].events.length);
      setLoading(false);
    } catch (error) {
      setAlertMsg("Something went wrong Please try Again Later");
      setSeverity("error");
      setXposition("center");
      setYposition("top");
      setOpen(true);
      console.log(`Error occured getAllEventsById ${error}`);
    }
  };

  const deleteAllEvent = async () => {
    const response = await eventService.deleteAllEvents();
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

  const columns = [
    // {
    //   field: "_id",
    //   headerName: "Action",
    //   width: 120,
    //   renderCell: renderActionButton,
    //   disableClickEventBubbling: true,
    //   disableColumnMenu: true,
    //   sortable: false,
    // },
    {
      field: "Source",
      headerName: "Source IP",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Destination",
      headerName: "Destination IP",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Transport_Layer_Protocol",
      headerName: "Transport Layer Protocol",
      width: 220,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Source_Port",
      headerName: "Source Port",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Destination_Port",
      headerName: "Destination Port",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Event_Detected",
      headerName: "Event Detected",
      width: 190,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Timestamp",
      headerName: "Timestamp",
      width: 250,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  React.useEffect(() => {
    getAllEventsById(pageSize, pageNumber);
  }, [pageSize, pageNumber]);

  return (
    <div>
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
              onClick={deleteAllEvent}
            >
              Delete Event Collection
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
            getRowId={(r) => r.Timestamp}
            rows={eventDetails}
            columns={columns}
            loading={loading}
            paginationMode="server"
            pageSize={pageSize}
            rowCount={totalEvents}
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
    </div>
  );
};

export default Event;
