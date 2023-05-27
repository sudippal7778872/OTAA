import React, { memo } from "react";
import { Typography, Button, Stack, Input, Divider, Box } from "@mui/material/";
import MUISnackbar from "../../common/snackbar/Snackbar";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import fileUploadService from "../../../services/fileupload/fileupload.service";
import AssetService from "../../../services/asset/asset.service";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import LinearProgress from "@mui/material/LinearProgress";
import PropTypes from "prop-types";
import { Cookies } from "react-cookie";

const UploadPPMCData = memo(() => {
  const cookiesData = new Cookies();
  const userData = cookiesData.get("UserObj");
  const userId = userData?._id;

  const initialState = {
    AttachmentPID: null,
    userId: userId,
    fileNamePath: null,
  };
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [file, setFile] = React.useState();
  const [fileName, setFileName] = React.useState("");
  const [disableUpload, setDisableBtnUpload] = React.useState(true);
  const [uploadedFile, setUploadFile] = React.useState([]);
  const [progress, setProgress] = React.useState(null);
  const [uploadFileInformation, setUploadFileInformation] =
    React.useState(initialState);
  // const [attachmentData, setAttachmentData] = React.useState(null);
  const ref = useRef();

  const handleClose = () => {
    setOpen(false);
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    // setDisableBtnUpload(false);
  };

  const handleDelete = () => {
    setUploadFile("");
  };

  const handleUpload = async () => {
    setDisableBtnUpload(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("userId", userId);
    const onUploadProgress = (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    };
    fileUploadService
      .UploadFile(formData, onUploadProgress)
      .then((res) => {
        console.log("response", res.data);
        // setAttachmentData(res.data);
        // clearInterval(timer);
        let attachmentPid = +res?.data?.AttachmentPID;
        setAlertMsg("Uploaded Successfully");
        setSeverity("success");
        setOpen(true);
        setTimeout(() => {
          handleClose();
        }, 1000);
        ref.current.value = "";
        setUploadFile([...uploadedFile, fileName]);
        setDisableBtnUpload(true);
        setUploadFileInformation({
          ...uploadFileInformation,
          AttachmentPID: attachmentPid,
          fileNamePath: res.data.fileName,
        });
      })
      .catch((error) => {
        setAlertMsg("Uploaded Failed");
        setSeverity("error");
        setOpen(true);
      });
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setUploadFileInformation({ ...uploadFileInformation, [name]: value });
  // };

  const onSubmit = () => {
    console.log("form submitted", uploadFileInformation);
    AssetService.createAnalyzerData(uploadFileInformation)
      .then((res) => {
        console.log("successfully saved", res);
        window.alert("Saved Successfully");
        setAlertMsg("Submitted Successfully");
        setSeverity("success");
        setOpen(true);
        setTimeout(() => {
          handleClose();
        }, 1000);
      })
      .catch((err) => {
        console.log("error occured in submit", err);
        setAlertMsg("Submit Failed");
        setSeverity("error");
        setOpen(true);
      });
  };

  return (
    <>
      <MUISnackbar
        open={open}
        handleClose={handleClose}
        alertMsg={alertMsg}
        severity={severity}
      />
      <form noValidate>
        <Stack>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Upload PPMC Data
          </Typography>
          <Divider />
          <br />
        </Stack>
        <Stack direction="column" spacing={3} style={{ alignItems: "center" }}>
          <Typography>
            <b>Please upload the latest PCAP file below</b>
            <br />
            <br />
            <b>PCAP File: &nbsp;&nbsp;</b>
            <Input
              type="file"
              ID="fileSelect"
              inputProps={{ accept: ".pcap" }}
              onChange={saveFile}
              ref={ref}
              // disabled={}
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={() => {
                handleUpload();
              }}
              // disabled={disableUpload}
            >
              Upload
            </Button>
            {progress > 0 && uploadedFile ? (
              <>
                <LinearProgressWithLabel value={progress} />
                <b>Uploaded file :</b> {[uploadedFile]}
                &nbsp;
                <DeleteIcon
                  type="button"
                  color="error"
                  onClick={() => {
                    handleDelete(uploadedFile);
                  }}
                />
              </>
            ) : (
              <></>
            )}
            <br />
            &nbsp;&nbsp;
            {/* {uploadedFile ? (
              <>
                <b>Uploaded file :</b> {[uploadedFile]}
                &nbsp;
                <DeleteIcon
                  type="button"
                  color="error"
                  onClick={() => {
                    handleDelete(uploadedFile);
                  }}
                />
              </>
            ) : (
              <></>
            )} */}
          </Typography>
        </Stack>
        <br />
      </form>
      <>
        <Stack
          direction="row"
          spacing={3}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <Button variant="contained" color="error" type="button">
            Cancel
          </Button>
        </Stack>
      </>
    </>
  );
});

export default UploadPPMCData;
