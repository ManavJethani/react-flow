import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  ButtonBase,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  FormControl,
  MenuItem,
} from "@mui/material";
import "./style.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { FLOW_DESIGN_CONSTANT } from "../../constants";
import HighlightedText from "../highligher";

let id = new Date();
const getId = () => `${++id}`;

function SimpleDialog(props) {
  const { onClose, open } = props;
  const [selectedText, setSelectedText] = React.useState({
    id: `tag_` + getId(),
    text: "",
    index: null,
  });
  const [newTagFlag, setNewTagFlag] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleClose = () => {
    onClose(false);
  };

  const [searchText, setSearchText] = React.useState("");

  const initializeSelected = () => {
    setSelectedText({ id: `tag_` + getId(), text: "", index: null });
  };

  // React.useEffect(() => {
  //   document.addEventListener("mouseup", getSelectedElement);
  //   return () => {
  //     document.removeEventListener("mouseup", getSelectedElement);
  //   };
  // }, []);

  const getSelectedElement = () => {
    let selection = window.getSelection();
    if (selection) {
      let range = selection.getRangeAt(0);
      let dom = range?.startContainer.parentNode;
      if (dom.getAttribute("id") === "highlight-area") {
        let value = window.getSelection().toString();
        if (value) {
          setSelectedText((prev) => ({
            ...prev,
            text: value,
            startOffset: range.startOffset,
            endOffset: range.endOffset,
          }));
        }
      }
    }
  };

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const getIndex = (name) => {
    let originalIndex = props.currentIntent.utterances.findIndex(
      (ele) => ele.name === name
    );
    return originalIndex;
  };

  return (
    <Dialog onClose={handleClose} open={open} fullScreen>
      <DialogTitle className="intent-header">
        {FLOW_DESIGN_CONSTANT.INTENT_SETTINGS}
      </DialogTitle>
      <DialogContent className="dialog-container">
        <div style={{ flex: 1 }}>
          <TextField
            label="Intent Name"
            value={props.currentIntent.intentName}
            fullWidth
            className="text-field"
            onChange={props.handleIntentName}
          />
          <div>
            <TextField
              multiline
              rows={6}
              label="Utterances"
              fullWidth
              inputRef={props.utteranceRef}
              placeholder="Add sample phrases or words"
            />
            <div className="utterance-container">
              <Button variant="contained" onClick={props.addUtterance}>
                {FLOW_DESIGN_CONSTANT.ADD}
              </Button>
            </div>
          </div>
          {props.currentIntent?.utterances?.length > 0 && (
            <TextField
              label="Search Utterance"
              onChange={handleSearchInput}
              value={searchText}
            />
          )}
          {props.currentIntent.utterances
            .filter((element) => {
              if (searchText === "") {
                return element;
              } else if (
                element.name.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return element;
              }
            })
            .map((ele, index) => {
              return (
                <>
                  <div
                    className="utterance-list"
                    key={getIndex(ele.name)}
                    id={"utterance" + getIndex(ele.name)}
                  >
                    <span
                      id={"uttr_name" + getIndex(ele.name)}
                      index={getIndex(ele.name)}
                      name="uttr-list"
                      className="uttr-list"
                    >
                      <HighlightedText
                        text={ele.name}
                        offsets={ele.tags ? ele.tags : []}
                      />
                    </span>
                    <div>
                      <Button
                        // disabled={selectedText.index != getIndex(ele.name)}
                        sx={{
                          color: "black",
                          border: "1px solid",
                          margin: "0px 10px",
                        }}
                        onClick={() => {
                          setSelectedIndex(getIndex(ele.name));
                          initializeSelected();
                          // props.handleAddTag(selectedText);
                        }}
                        variant="outlined"
                      >
                        {FLOW_DESIGN_CONSTANT.ADD_TAG}
                      </Button>
                      <ButtonBase
                        onClick={() => props.handleUtteranceDelete(ele)}
                      >
                        <DeleteOutlineIcon />
                      </ButtonBase>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className="tag-side-panel">
          <div className="tag-header">
            <Typography variant="h6">{FLOW_DESIGN_CONSTANT.TAG}</Typography>
          </div>
          {selectedIndex !== null && (
            <div>
              <div
                onMouseUp={getSelectedElement}
                id="highlight-area"
                className="highlight-area"
              >
                {props.currentIntent.utterances[selectedIndex]?.name}
              </div>
              <span style={{ fontSize: 12, color: "dimGray" }}>
                select a word to add a tag
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  margin: "10px 0px",
                }}
              >
                <Button
                  onClick={() => {
                    setNewTagFlag(false);
                    props.handleAddTag(selectedText, selectedIndex);
                  }}
                  variant="outlined"
                  disabled={!selectedText.text}
                >
                  Attach Tag
                </Button>
              </div>
              {props.currentIntent.utterances[selectedIndex]?.tags?.map(
                (ele, index) => {
                  return (
                    <>
                      <Box className="tag-container">
                        <span className="text-style">{ele.text}</span>
                        <div className="tag-input-container">
                          {!ele.new ? (
                            <FormControl className="tag-input">
                              <TextField
                                select
                                labelId="predef-tags"
                                id="predef-tags"
                                label="Predefined Tag"
                                onChange={(e) =>
                                  props.handleAttachTag(
                                    e,
                                    ele.id,
                                    selectedIndex
                                  )
                                }
                                value={ele.tagName}
                              >
                                {props.predefinedTags?.map((element, index) => {
                                  return (
                                    <MenuItem
                                      value={element.tagName}
                                      key={index}
                                    >
                                      {element.tagName}
                                    </MenuItem>
                                  );
                                })}

                                <Button
                                  onClick={(e) =>
                                    props.handleAddNewTag(
                                      e,
                                      ele.id,
                                      selectedIndex
                                    )
                                  }
                                >
                                  add new
                                </Button>
                              </TextField>
                            </FormControl>
                          ) : (
                            <TextField
                              placeholder="Type tag name here"
                              onBlur={(e) =>
                                props.handleAddToPredefinedTags(
                                  e,
                                  ele.id,
                                  selectedIndex
                                )
                              }
                              className="tag-input"
                            />
                          )}

                          <Button
                            onClick={(e) =>
                              props.handleTageDelete(e, ele, selectedIndex)
                            }
                            className="delete-tag"
                          >
                            <DeleteOutlineIcon />
                          </Button>
                        </div>
                      </Box>
                    </>
                  );
                }
              )}
              {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setNewTagFlag(true)}>Add new tag</Button>
              </div> */}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={props.addIntent}
          autoFocus
          variant="contained"
          disabled={!props.currentIntent.intentName}
        >
          {FLOW_DESIGN_CONSTANT.DONE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default function IntentDialog(props) {
  return (
    <div>
      <SimpleDialog
        open={props.open}
        onClose={props.handleDialogClose}
        updateIntent={props.updateIntent}
        selectedId={props.selectedId}
        currentIntent={props.currentIntent}
        addUtterance={props.addUtterance}
        utteranceRef={props.utteranceRef}
        handleIntentName={props.handleIntentName}
        addIntent={props.addIntent}
        handleUtteranceDelete={props.handleUtteranceDelete}
        handleAddTag={props.handleAddTag}
        handleAttachTag={props.handleAttachTag}
        // handleHighlightText={props.handleHighlightText}
        handleTageDelete={props.handleTageDelete}
        utteranceDeleted={props.utteranceDeleted}
        predefinedTags={props.predefinedTags}
        handleAddNewTag={props.handleAddNewTag}
        handleAddToPredefinedTags={props.handleAddToPredefinedTags}
      />
    </div>
  );
}
