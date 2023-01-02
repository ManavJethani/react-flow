import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogActions, DialogContent, Typography } from "@mui/material";
import "./style.css";
import { useDropzone } from "react-dropzone";
import FileProgress from "../LinearProgress";

function MyDropzone(props) {
  const onDrop = React.useCallback((acceptedFiles) => {
    props.addFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // "audio/mpeg3" : ['.mp3']
    },
  });

  if (props.file) {
    return (
      <div className="file-container">
        <div style={{ margin: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>{props.file.name}</div>
            {props.file.name && (
              <Typography variant="caption" color="#333333">
                Uploaded
              </Typography>
            )}
          </div>
          <FileProgress file={props.file} />
        </div>
      </div>
    );
  } else {
    return (
      <div {...getRootProps()} className="dropzone-container">
        <input
          {...getInputProps()}
          accept="audio/mp3,audio/*;capture=microphone"
        />
        {isDragActive ? (
          <p>Drag in a file</p>
        ) : (
          <p style={{ textAlign: "center" }}>
            <p>Drag in a file</p>
            <p>or</p>
            <p>Browse</p>
          </p>
        )}
      </div>
    );
  }
}

function SimpleDialog(props) {
  const { onClose, open } = props;
  const [file, setFile] = React.useState(null);

  const addFile = (data) => {
    setFile(data);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        "& .MuiPaper-root": {
          width: 800,
          maxHeight: 800,
        },
      }}
    >
      <DialogTitle>Add Audio</DialogTitle>
      <DialogContent>
        <MyDropzone addFile={addFile} file={file} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          autoFocus
          variant="contained"
          onClick={(e) => props.handleAddAudioFile(e, file)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default function AudioDialog(props) {
  return (
    <div>
      <SimpleDialog
        open={props.open}
        onClose={props.handleDialogClose}
        handleAddAudioFile={props.handleAddAudioFile}
      />
    </div>
  );
}
