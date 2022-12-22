import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, useThemeProps } from '@mui/material';
import './style.css'
import IntentDialog from '../intentdialog';

let id = new Date()
const getId = () => `${++id}`;

export default function IntentSettings(props) {
    const [intent, setIntent] = React.useState({
        intentName: '',
        utterances: []
    });
    const [open, setOpen] = React.useState(false);
    const utteranceRef = React.useRef('')


    const handleOptionChange = (event) => {
        const { content } = props.selectedId;
        const selectedIntent = content.intents.find(ele => ele.intentName === event.target.value)
        setIntent(selectedIntent);
    };

    const handleDialogClose = () => {
        setOpen(false);
    }

    const handleNew = () => {
        setIntent({
            id: `int_` + getId(),
            intentName: '',
            utterances: []
        });
        setOpen(true)
    }

    const addUtterance = () => {
        if (utteranceRef.current.value) {
            setIntent(prev => ({
                ...prev,
                utterances: [...intent.utterances, utteranceRef.current.value]
            }))
        }
    }

    const addIntent = () => {
        let selectedNode = { ...props.selectedId }
        const i = selectedNode.content.intents.findIndex(_element => _element.id === intent.id);
        if (i > -1) {
            selectedNode.content.intents[i] = intent;
        } else {
            selectedNode.content.intents.push(intent)
        }
        props.updateIntent(selectedNode)
    }

    const handleIntentName = (e) => {
        setIntent(prev => ({
            ...prev,
            intentName: e.target.value
        }))
    }

    const handleUtteranceDelete = (item) => {
        setIntent(prev => ({
            ...prev,
            utterances: [...intent.utterances.filter((ele) => ele !== item )]
        }))
    }

    const { content } = props.selectedId;

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
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="select-intent">Select Intent</InputLabel>
                    <Select
                        labelId="select-intent"
                        id="select-intent"
                        value={intent ? intent.intentName : ''}
                        label="Select Intent"
                        onChange={handleOptionChange}
                    >
                        {content.intents?.map((ele,index) => {
                            return <MenuItem value={ele.intentName} key={index}>{ele.intentName}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Box>
            <div className="add-new-container">
                <Button onClick={() => setOpen(true)}>
                    + Add New
                </Button>
            </div>
            <div className="add-intent-container">
                <Button onClick={handleNew} fullWidth variant="contained">
                    Add Intent
                </Button>
            </div>
        </>
    );
}