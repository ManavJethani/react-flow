import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { ButtonBase, DialogActions, DialogContent, TextField } from '@mui/material';
import './style.css'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function SimpleDialog(props) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog onClose={handleClose} open={open}
            sx={{
                '& .MuiPaper-root': {
                    width: 800,
                    maxHeight: 800
                }
            }}
        >
            <DialogTitle>Add Intent</DialogTitle>
            <DialogContent>
                <TextField label="Intent Name" value={props.currentIntent.intentName} fullWidth className='text-field' onChange={props.handleIntentName} />
                <div>
                    <TextField multiline rows={6} label="Utterances" fullWidth inputRef={props.utteranceRef} placeholder="Add sample phrases or words" />
                    <div className='utterance-container'>
                        <Button variant='contained' onClick={props.addUtterance}>Add</Button>
                    </div>
                </div>
                {props.currentIntent.utterances.map((ele, index) => {
                    return <div className='utterance-list' key={index}>
                        <span>{ele}</span>
                        <ButtonBase onClick={() => props.handleUtteranceDelete(ele)}>
                            <DeleteOutlineIcon />
                        </ButtonBase>
                    </div>
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={props.addIntent} autoFocus variant='contained'>
                    Done
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
            />
        </div>
    );
}