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
import { cloneDeep } from "lodash";
import { FLOW_DESIGN_CONSTANT } from "../../constants";

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
      let newArray = [];
      for (let i = 0; i < valueArr.length; i++) {
        if (valueArr[i]) {
          let newObject = {};
          newObject.id = `uttr_` + getId();
          newObject.name = valueArr[i];
          newObject.tags = [];
          newArray.push(newObject);
        }
      }
      setIntent((prev) => ({
        ...prev,
        utterances: [...intent.utterances, ...newArray],
      }));
    }
  };

  const handleAddTag = (value) => {
    if (value.text) {
      let indexValue = intent.utterances[value.index].tags.findIndex(
        (ele) => ele.id === value.id
      );
      let intentCopy = cloneDeep(intent);
      if (indexValue === -1) {
        intentCopy.utterances[value.index].tags.push({
          text: value.text,
          tagName: "",
          id: `tag_` + getId(),
        });
      }
      setIntent(intentCopy);
    }
  };

  const handleAttachTag = (e, id, index) => {
    let indexValue = intent.utterances[index].tags.findIndex(
      (ele) => ele.id === id
    );
    let intentCopy = cloneDeep(intent);
    intentCopy.utterances[index].tags[indexValue].tagName = e.target.value;
    setIntent(intentCopy);
  };

  const addIntent = () => {
    let updatedIntentList = cloneDeep(props.intentLibrary);
    const i = updatedIntentList.findIndex(
      (_element) => _element.id === intent.id
    );
    if (i > -1) {
      updatedIntentList[i] = intent;
    } else {
      updatedIntentList.push(intent);
    }
    props.updateIntentLibrary(updatedIntentList);
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
      utterances: [
        ...intent.utterances.filter((ele) => ele.name !== item.name),
      ],
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

  const handleHighlightText = (e, ele, index) => {
    if (ele.text && ele.tagName) {
      let intentCopy = cloneDeep(intent);
      if (intentCopy.utterances[index].highlightedText) {
        intentCopy.utterances[index].highlightedText.push(ele.text);
      } else {
        intentCopy.utterances[index].highlightedText = [];
        intentCopy.utterances[index].highlightedText.push(ele.text);
      }
      setIntent(intentCopy);
    }
  };

  const handleTageDelete = (e, ele, index) => {
    let removeTag = intent.utterances[index].tags.filter(
      (tag) => tag.id !== ele.id
    );
    let removeHighlightedText = intent.utterances[
      index
    ].highlightedText?.filter((tag) => tag !== ele.text);
    let intentCopy = cloneDeep(intent);
    intentCopy.utterances[index].tags = removeTag;
    intentCopy.utterances[index].highlightedText = removeHighlightedText;
    setIntent(intentCopy);
  };

  return (
    <>
      {open && (
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
          handleAddTag={handleAddTag}
          handleAttachTag={handleAttachTag}
          handleHighlightText={handleHighlightText}
          handleTageDelete={handleTageDelete}
        />
      )}
      {props.selectedIntent.map((ele, index) => {
        return (
          <div>
            <Box sx={{ minWidth: 120, display: "flex", margin: "15px 0px" }}>
              <FormControl fullWidth>
                <InputLabel id="select-intent">
                  {FLOW_DESIGN_CONSTANT.SELECT_INENT}
                </InputLabel>
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
                      {FLOW_DESIGN_CONSTANT.ADD_NEW}
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
          {FLOW_DESIGN_CONSTANT.ADD_INTENT}
        </Button>
      </div>
    </>
  );
}
