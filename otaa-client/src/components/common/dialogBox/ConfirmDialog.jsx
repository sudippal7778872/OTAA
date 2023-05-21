import React from "react";
import { Button, TextField } from "@mui/material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./ConfirmDialog.css";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ConfirmDialog = (props) => {
  const theme = useTheme();
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const {
    title,
    content,
    open,
    setOpen,
    value,
    setValue,
    onConfirm,
    onCancel,
    capabilityid,
  } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    onCancel();
  };

  const handleOk = (e) => {
    e.preventDefault();
    setOpen(false);
    onConfirm();
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        fullScreen={fullScreen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <form onSubmit={handleOk}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <br />
              {content}
              <br />

              <TextField
                id="outlined-multiline-static"
                label="Notes"
                multiline
                rows={4}
                value={value}
                //    defaultValue="Default Value"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                fullWidth
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={(e) => {
                handleOk(e);
              }}
              autoFocus
              variant="outlined"
              color="success"
            >
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
