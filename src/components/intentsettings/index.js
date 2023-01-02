import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import "./style.css";
import IntentDialog from "../intentdialog";
import { Edit } from "@mui/icons-material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

let id = new Date();
const getId = () => `${++id}`;

export default function IntentSettings(props) {
  const [intent, setIntent] = React.useState({
    intentName: "",
    utterances: [],
  });
  const [open, setOpen] = React.useState(false);
  const utteranceRef = React.useRef("");

  React.useEffect(() => {
    if (props.selectedId?.content?.intents) {
      props.updateIntentList(props.selectedId?.content?.intents);
    }
  }, []);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleOptionChange = (event, index) => {
    let selected = props.intentLibrary.find(
      (ele) => ele.intentName === event.target.value
    );
    let intentListCopy = [...props.selectedIntent];
    intentListCopy[index] = selected;
    props.updateIntentList(intentListCopy);
  };

  const handleNew = (e, obj) => {
    if (obj) {
      setIntent(obj);
    } else {
      setIntent({
        id: `int_` + getId(),
        intentName: "",
        utterances: [],
      });
    }
    setOpen(true);
  };

  const addUtterance = () => {
    if (utteranceRef.current.value) {
      let valueArr = utteranceRef.current.value.split("\n");
      let filteringSpaces = valueArr.filter((ele) => ele !== "");
      setIntent((prev) => ({
        ...prev,
        utterances: [...intent.utterances, ...filteringSpaces],
      }));
    }
  };

  const addIntent = () => {
    let updatedIntentList = [...props.intentLibrary];
    const i = updatedIntentList.findIndex(
      (_element) => _element.id === intent.id
    );
    if (i > -1) {
      updatedIntentList[i] = intent;
    } else {
      updatedIntentList.push(intent);
    }
    props.updateIntentLibrary(updatedIntentList);
    props.updateIntentList(updatedIntentList);
    handleDialogClose();
  };

  const handleIntentName = (e) => {
    setIntent((prev) => ({
      ...prev,
      intentName: e.target.value,
    }));
  };

  const handleUtteranceDelete = (item) => {
    setIntent((prev) => ({
      ...prev,
      utterances: [...intent.utterances.filter((ele) => ele !== item)],
    }));
  };

  const handleDelete = (index) => {
    let newList = props.selectedIntent.filter((element, ind) => ind !== index);
    props.updateIntentList(newList);
  };

  const handleAddNewIntent = () => {
    const newIntent = {
      id: "new",
      intentName: "",
      utterances: [],
    };
    props.updateIntentList([...props.selectedIntent, newIntent]);
  };

  return (
    <>
      <IntentDialog
        open={open}
        handleDialogClose={handleDialogClose}
        selectedId={props.selectedId}
        updateIntent={props.updateIntent}
        currentIntent={intent}
        addUtterance={addUtterance}
        utteranceRef={utteranceRef}
        handleIntentName={handleIntentName}
        addIntent={addIntent}
        handleUtteranceDelete={handleUtteranceDelete}
      />
      {props.selectedIntent.map((ele, index) => {
        return (
          <div>
            <Box sx={{ minWidth: 120, display: "flex", margin: "15px 0px" }}>
              <FormControl fullWidth>
                <InputLabel id="select-intent">Select Intent</InputLabel>
                <Select
                  labelId="select-intent"
                  id="select-intent"
                  value={ele.intentName}
                  label="Select Intent"
                  onChange={(e) => handleOptionChange(e, index)}
                  endAdornment={
                    <Button
                      position="end"
                      disabled={!ele.intentName}
                      className="delete-btn"
                      onClick={(e) => handleNew(e, ele)}
                    >
                      <Edit size={10} style={{ marginRight: 20 }} />
                    </Button>
                  }
                >
                  {props.intentLibrary?.map((element, index) => {
                    return (
                      <MenuItem value={element.intentName} key={index}>
                        {element.intentName}
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

      <div className="add-intent-container">
        <Button onClick={handleAddNewIntent} fullWidth variant="contained">
          Add Intent
        </Button>
      </div>
    </>
  );
}
