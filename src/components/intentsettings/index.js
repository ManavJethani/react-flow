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
import { cloneDeep, debounce } from "lodash";
import { FLOW_DESIGN_CONSTANT } from "../../constants";

let id = new Date();
const getId = () => `${++id}`;

function getRandomColor() {
  const minIntensity = 150; // Minimum intensity for each RGB channel (0-255)

  // Generate random RGB values within the minimum intensity range
  const red =
    Math.floor(Math.random() * (255 - minIntensity + 1)) + minIntensity;
  const green =
    Math.floor(Math.random() * (255 - minIntensity + 1)) + minIntensity;
  const blue =
    Math.floor(Math.random() * (255 - minIntensity + 1)) + minIntensity;

  // Convert RGB values to hexadecimal color code
  const colorCode = `#${red.toString(16)}${green.toString(16)}${blue.toString(
    16
  )}`;

  return colorCode;
}

export default function IntentSettings(props) {
  const [intent, setIntent] = React.useState({
    intentName: "",
    utterances: [],
  });
  const [open, setOpen] = React.useState(false);
  const utteranceRef = React.useRef("");
  const utteranceDeleted = React.useRef(false);
  const [predefinedTags, setPredefinedTags] = React.useState([
    {
      tagName: "Time",
      color: "yellow",
    },
    {
      tagName: "Date",
      color: "lightGreen",
    },
    {
      tagName: "Action",
      color: "pink",
    },
  ]);

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

  // adding new utterances
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
      let utterances = [...intent.utterances, ...newArray];
      let uniqueUtterances = Array.from(
        new Set(utterances.map((a) => a.name))
      ).map((name) => {
        return utterances.find((a) => a.name === name);
      });
      utteranceRef.current.value = "";
      setIntent((prev) => ({
        ...prev,
        utterances: uniqueUtterances,
      }));
    }
  };

  // check if word already been tagged using offsets
  function isNumberInRange(number, min, max) {
    return number >= min && number <= max;
  }

  // check if word already been tagged using offsets
  function checkTagExist(tagArray, newTag) {
    for (let i = 0; i < tagArray.length; i++) {
      let inRange = isNumberInRange(
        newTag.startOffset,
        tagArray[i].startOffset,
        tagArray[i].endOffset
      );
      if (inRange) {
        return true;
      }
    }
    return false;
  }

  // adding a tag inside utterance
  const handleAddTag = (value, index) => {
    let intentCopy = cloneDeep(intent);
    if (value.text) {
      if (!intent.utterances[index].tags) {
        intentCopy.utterances[index].tags = [];
      }
      let indexValue = intentCopy.utterances[index].tags.findIndex(
        (ele) => ele.id === value.id
      );

      let tagsArray = intentCopy.utterances[index].tags;

      let tagExist = checkTagExist(tagsArray, value);

      if (tagExist) {
        alert("tag already exist");
      } else {
        if (indexValue === -1) {
          intentCopy.utterances[index].tags.push({
            text: value.text,
            tagName: "",
            id: `tag_` + getId(),
            startOffset: value.startOffset,
            endOffset: value.endOffset,
          });
        }
        const sortedIntent = intentCopy.utterances[index].tags.sort(
          (a, b) => a.startOffset - b.startOffset
        );
        intentCopy.utterances[index].tags = [...sortedIntent];

        const selection = window.getSelection();
        selection.removeAllRanges();
        setIntent(intentCopy);
      }
    }
  };

  // attaching a tag to a selected word
  const handleAttachTag = (e, id, index) => {
    let indexValue = intent.utterances[index].tags.findIndex(
      (ele) => ele.id === id
    );
    let intentCopy = cloneDeep(intent);
    let tagFromPredefined = predefinedTags.find(
      (ele) => ele.tagName === e.target.value
    );
    let newTag = intentCopy.utterances[index].tags[indexValue].new;

    if (tagFromPredefined && !newTag) {
      intentCopy.utterances[index].tags[indexValue].tagName =
        tagFromPredefined.tagName;
      intentCopy.utterances[index].tags[indexValue].color =
        tagFromPredefined.color;
    } else {
      let tagName = e.target.value;
      let color = getRandomColor();
      intentCopy.utterances[index].tags[indexValue].tagName = tagName;
      intentCopy.utterances[index].tags[indexValue].color = color;
      intentCopy.utterances[index].tags[indexValue].new = false;
      setPredefinedTags([
        ...predefinedTags,
        { tagName: tagName, color: color },
      ]);
    }
    setIntent(intentCopy);
  };

  const debouncedAttachTag = debounce(handleAttachTag, 200);

  // adding new intent
  const addIntent = () => {
    // this part can be more optimized
    let updatedIntentList = cloneDeep(props.intentLibrary);
    let updateSelectedIntent = cloneDeep(props.selectedIntent);

    // check if intent already exist in intent library
    const i = updatedIntentList.findIndex(
      (_element) => _element.id === intent.id
    );
    // if yes, update the intent library
    if (i > -1) {
      updatedIntentList[i] = intent;
    } else {
      updatedIntentList.push(intent);
    }

    // check if intent already exist in selected intents
    const selectedIndex = props.selectedIntent.findIndex(
      (_element) => _element.id === intent.id
    );
    // if yes, update the selected intent
    if (selectedIndex > -1) {
      updateSelectedIntent[selectedIndex] = intent;
    }

    props.updateIntentLibrary(updatedIntentList);
    props.updateIntentList(updateSelectedIntent);
    handleDialogClose();
  };

  const handleIntentName = (e) => {
    setIntent((prev) => ({
      ...prev,
      intentName: e.target.value,
    }));
  };

  // delete an utterance in an intent
  const handleUtteranceDelete = (item) => {
    setIntent((prev) => ({
      ...prev,
      utterances: [
        ...intent.utterances.filter((ele) => ele.name !== item.name),
      ],
    }));
    utteranceDeleted.current = true;
  };

  // delete an intent
  const handleDelete = (index) => {
    let newList = props.selectedIntent.filter((element, ind) => ind !== index);
    props.updateIntentList(newList);
  };

  // push new intent in a list
  const handleAddNewIntent = () => {
    const newIntent = {
      id: "new",
      intentName: "",
      utterances: [],
    };
    props.updateIntentList([...props.selectedIntent, newIntent]);
  };

  // delete a tag inside an utterance
  const handleTageDelete = (e, ele, index) => {
    let removeTag = intent.utterances[index].tags.filter(
      (tag) => tag.id !== ele.id
    );
    let intentCopy = cloneDeep(intent);
    intentCopy.utterances[index].tags = removeTag;
    setIntent(intentCopy);
  };

  // render a textfield on click of add new button
  const handleAddNewTag = (e, id, index) => {
    setIntent((prevState) => {
      let intentCopy = cloneDeep(prevState);
      let indexValue = intentCopy.utterances[index].tags.findIndex(
        (ele) => ele.id === id
      );
      if (indexValue !== -1) {
        intentCopy.utterances[index].tags[indexValue].new = true;
      }
      return intentCopy;
    });
  };

  // add new tag to predefined tags
  const handleAddToPredefinedTags = (e, id, index) => {
    if (e.target.value) {
      let tagFromPredefined = predefinedTags.find(
        (ele) => ele.tagName.toLowerCase() === e.target.value.toLowerCase()
      );
      if (tagFromPredefined) {
        alert("tag already exist in predefined tags");
      } else {
        let indexValue = intent.utterances[index].tags.findIndex(
          (ele) => ele.id === id
        );
        let tagName = e.target.value;
        let color = getRandomColor();
        let intentCopy = cloneDeep(intent);
        intentCopy.utterances[index].tags[indexValue].tagName = tagName;
        intentCopy.utterances[index].tags[indexValue].color = color;
        delete intentCopy.utterances[index].tags[indexValue].new;
        setPredefinedTags([
          ...predefinedTags,
          { tagName: tagName, color: color },
        ]);
        setIntent(intentCopy);
      }
    }
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
          handleAttachTag={debouncedAttachTag}
          handleTageDelete={handleTageDelete}
          utteranceDeleted={utteranceDeleted}
          predefinedTags={predefinedTags}
          handleAddNewTag={handleAddNewTag}
          handleAddToPredefinedTags={handleAddToPredefinedTags}
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
