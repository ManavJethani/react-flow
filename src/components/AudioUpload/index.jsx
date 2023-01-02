import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import React from "react";
import "./style.css";
import AudioDialog from "../AudioDialog";

let id = new Date();
const getAudioId = () => `audio_${++id}`;

const AudioUpload = (props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (props.selectedId?.content?.selectedAudio) {
      props.updateAudioList(props.selectedId?.content?.selectedAudio);
    }
  }, []);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAddNewAudio = () => {
    const newAudio = {
      id: "new",
      audioName: "",
      url: "",
      type: "audio",
    };
    props.updateAudioList([...props.selectedAudio, newAudio]);
  };

  const handleAddNumber = () => {
    const newAudio = {
      id: "new",
      numberType: "",
      number: "",
      type: "number",
    };
    props.updateAudioList([...props.selectedAudio, newAudio]);
  };

  const handleOptionChange = (event, index) => {
    let selected = props.audioLibrary.find(
      (ele) => ele.audioName === event.target.value
    );
    let audioCopy = [...props.selectedAudio];
    audioCopy[index] = selected;
    props.updateAudioList(audioCopy);
  };

  const handleNumberType = (event, index) => {
    let numberType = event.target.value;
    let audioCopy = props.selectedAudio.map((ele, ind) =>
      ind === index
        ? {
            ...ele,
            numberType: numberType,
            id: ele.id === "new" ? getAudioId() : ele.id,
          }
        : ele
    );
    props.updateAudioList(audioCopy);
  };

  const handleDelete = (index) => {
    let newList = props.selectedAudio.filter((element, ind) => ind !== index);
    props.updateAudioList(newList);
  };

  const handleNew = () => {
    setOpen(true);
  };

  const handleAddAudioFile = (e, file) => {
    let newAudio = {
      id: getAudioId(),
      audioName: file.name,
      url: file.path,
      type: "audio",
    };
    let audioLibCopy = [...props.audioLibrary];
    audioLibCopy.push(newAudio);
    setOpen(false);
    props.updateAudioLibrary(audioLibCopy);
  };

  const onNumberChange = (e, index) => {
    let number = e.target.value;
    let audioCopy = props.selectedAudio.map((ele, ind) =>
      ind === index
        ? {
            ...ele,
            number: number,
            id: ele.id === "new" ? getAudioId() : ele.id,
          }
        : ele
    );
    props.updateAudioList(audioCopy);
  };

  return (
    <div>
      <AudioDialog
        open={open}
        handleDialogClose={handleDialogClose}
        handleAddAudioFile={handleAddAudioFile}
      />

      {props.selectedAudio.map((ele, index) => {
        return (
          <div>
            <Box sx={{ minWidth: 120, display: "flex", margin: "15px 0px" }}>
              {ele.type === "audio" ? (
                <FormControl fullWidth>
                  <InputLabel id="select-audio">Select Audio</InputLabel>
                  <Select
                    labelId="select-audio"
                    id="select-intent"
                    value={ele.audioName}
                    label="Select Audio"
                    onChange={(e) => handleOptionChange(e, index)}
                    endAdornment={
                      <Button
                        position="end"
                        disabled={!ele.audioName}
                        className="delete-btn"
                        onClick={(e) => handleNew(e, ele)}
                      >
                        <Edit size={10} style={{ marginRight: 20 }} />
                      </Button>
                    }
                  >
                    {props.audioLibrary?.map((element, index) => {
                      return (
                        <MenuItem value={element.audioName} key={index}>
                          {element.audioName}
                        </MenuItem>
                      );
                    })}
                    <MenuItem onClick={handleNew}>
                      <span style={{ color: "#1976d2", fontSize: 14 }}>
                        + Add New
                      </span>
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <>
                  <FormControl
                    fullWidth
                    sx={{
                      width: 100,
                    }}
                  >
                    <InputLabel id="type">Type</InputLabel>
                    <Select
                      labelId="type"
                      id="type"
                      value={ele.numberType}
                      label="Type"
                      onChange={(e) => handleNumberType(e, index)}
                    >
                      {["Alpha Numeric", "Number"].map((element, index) => {
                        return (
                          <MenuItem value={element} key={index}>
                            {element}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    className="number-text"
                    label="Number"
                    placeholder="Enter Value"
                    onChange={(e) => onNumberChange(e, index)}
                    value={ele.number}
                  />
                </>
              )}
              <Button
                onClick={() => handleDelete(index)}
                position="end"
                className="delete-btn"
              >
                <DeleteOutline />
              </Button>
            </Box>
          </div>
        );
      })}
      <div className="add-audio-btn-container">
        <Button onClick={handleAddNewAudio}>+ Add Audio file</Button>
        <Button onClick={handleAddNumber}>+ Add Number</Button>
      </div>
    </div>
  );
};

export default AudioUpload;
