import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const MUISnackbar = ({
  open,
  handleClose,
  alertMsg,
  severity,
  xposition,
  yposition,
}) => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={alertMsg}
        // action={action}
        anchorOrigin={{
          horizontal: xposition || "right",
          vertical: yposition || "bottom",
        }}
      >
        <Alert severity={severity}>{alertMsg} </Alert>
      </Snackbar>
    </>
  );
};

export default MUISnackbar;
