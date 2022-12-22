import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import './style.css'
import { Divider, TextField } from '@mui/material';
import { useEffect } from 'react';
import IntentSettings from '../intentsettings';

export default function SettingsDrawer(props) {
    const [input, setInput] = React.useState('')

    useEffect(()=>{
        if(props.selectedId && props.selectedId.title){
            setInput(props.selectedId.title)
        }
    },[props.selectedId])

    const renderTitle = (selectedId) => {
        if (selectedId) {
            const { name } = selectedId
            switch (name) {
                case 'audioUpload':
                    return 'Audio Settings';
                case 'listen':
                    return 'Listen Settings';
                case 'intentModel':
                    return 'Intent Settings';
                default:
                    return 'Audio Settings';
            }
        }
    }

    const renderContent = (selectedId) => {
        if (selectedId) {
            const { name } = selectedId
            switch (name) {
                case 'audioUpload':
                    return '';
                case 'listen':
                    return '';
                case 'intentModel':
                    return <IntentSettings selectedId={props.selectedId} updateIntent={props.updateIntent}/>
                default:
                    return 'Audio Settings';
            }
        }
    }

    const handleSave = () => {
        let data = {...props.selectedId}
        data.title = input
        props.onSaveClick(data)
    }

    return (
        <div>
            <Drawer
                anchor='right'
                open={props.openDrawer}
                onClose={() => props.toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
                }}
                BackdropProps={{ invisible: true }}
            >
                <div className='drawer-title'>
                    {renderTitle(props.selectedId)}
                </div>
                <div className='drawer-content'>
                    {props.selectedId && <TextField className='text-field' label="Block Name" value={input} onChange={(e) => setInput(e.target.value)} />}
                    {renderContent(props.selectedId)}
                </div>
                <div className='action-btn-drawer-container'>
                    <Divider />
                    <Button onClick={() => props.toggleDrawer(false)} className="cancel-btn">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </div>
            </Drawer>
        </div>
    );
}