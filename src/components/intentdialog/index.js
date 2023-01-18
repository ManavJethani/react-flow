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
} from "@mui/material";
import "./style.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Highlighter from "react-highlight-words";
import { FLOW_DESIGN_CONSTANT } from "../../constants";

let id = new Date();
const getId = () => `${++id}`;

function SimpleDialog(props) {
  const { onClose, open } = props;
  const [enableSelector, setEnableSelector] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState({
    id: `tag_` + getId(),
    text: "",
    index: null,
  });

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleClose = () => {
    onClose(false);
  };

  React.useEffect(() => {
    document.addEventListener("mouseup", getSelectedElement);
    return () => {
      document.removeEventListener("mouseup", getSelectedElement);
    };
  }, []);

  const getSelectedElement = React.useCallback(() => {
    let dom = window.getSelection().getRangeAt(0)?.startContainer.parentNode
      .parentNode.parentNode;
    if (dom.getAttribute("name") === "uttr-list") {
      let index = dom.getAttribute("index");
      let value = window.getSelection().toString();
      if (index !== selectedText.index && value) {
        setSelectedText((prev) => ({
          ...prev,
          text: value,
          index: index,
        }));
      }
    }
  }, [selectedText.index]);

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
          {props.currentIntent.utterances.map((ele, index) => {
            return (
              <>
                <div
                  className="utterance-list"
                  key={index}
                  id={"utterance" + index}
                >
                  <span id={"uttr_name" + index} index={index} name="uttr-list">
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={
                        ele.highlightedText ? ele.highlightedText : []
                      }
                      autoEscape={true}
                      textToHighlight={ele.name}
                    />
                  </span>
                  <div>
                    <Button
                      disabled={selectedText.index != index}
                      sx={{
                        color: "black",
                        border: "1px solid",
                        margin: "0px 10px",
                      }}
                      onClick={() => {
                        setSelectedIndex(index);
                        props.handleAddTag(selectedText);
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
          <div>
            {props.currentIntent.utterances[selectedIndex]?.tags.map(
              (ele, index) => {
                return (
                  <Box className="tag-container">
                    <span className="text-style">{ele.text}</span>
                    <div className="tag-input-container">
                      <TextField
                        value={ele.tagName ? ele.tagName : ""}
                        onChange={(e) =>
                          props.handleAttachTag(e, ele.id, selectedIndex)
                        }
                        onBlur={(e) =>
                          props.handleHighlightText(e, ele, selectedIndex)
                        }
                        label="Tag name"
                      />
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
                );
              }
            )}
          </div>
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
        handleHighlightText={props.handleHighlightText}
        handleTageDelete={props.handleTageDelete}
      />
    </div>
  );
}
