import React from 'react';
import './style.css'
import { Handle, Position } from 'reactflow';
import SettingsIcon from '@mui/icons-material/Settings';
import { ButtonBase } from '@mui/material';

let height = 0

const CustomizedNode = ({ data }) => {

    const onDelete = (id) => {
        handleDelete(id)
    }

    const nodeRef = React.useRef();
    const [dimensions, setDimensions] = React.useState({ width: 20, height: 20 });
    const [arr, setArr] = React.useState(['A', 'B'])

    React.useLayoutEffect(() => {
        if (nodeRef.current) {
            setDimensions({
                width: nodeRef.current.offsetWidth + dimensions.width,
                height: nodeRef.current.offsetHeight + dimensions.height
            });
        }
    }, []);

    const positionHandle = (index) => {
        if (index === 1) {
            height = dimensions.height - 10
            return dimensions.height - 10
        } else {
            height = height + 40
            return height
        }
    }

    const renderNodeContent = (name, content) => {
        switch (name) {
            case 'intentModel':
                return (
                    content.intents.map((ele, i) => {
                        return <div key={i} style={{ background: '#F2F2F2', margin: '1px 0px', padding: 12 }} ref={nodeRef}>
                            <div>{ele.intentName}</div>
                            <Handle
                                key={`dnd_${i}`}
                                type="source" //This is the handle type
                                position={Position.Right} //Just changed this as it would be good to be in parallel with the target
                                id={`dnd_${i}`}
                                style={{ top: positionHandle(i + 1) }}

                            /></div>
                    })
                )
            case 'audioUpload':
                return <div style={{ background: '#F2F2F2', margin: '1px 0px', padding: 12 }}>Audio File.mp3</div>
            case 'listen':
                return <div style={{ background: '#F2F2F2', margin: '1px 0px', padding: 12 }}>Connect to Intent Model</div>
            default:
                break;
        }
    }

    const { title, content, id, handleDelete, nodeType, onConfigure, name, nodes } = data;
    return (
        <div className='node-container' >
            <div className='heading-container'>
                {!nodeType && <Handle type="target" position={Position.Top} id={id} />}
                <h3 className='node-title'>{title}</h3>
                <button onClick={() => onDelete(id)} className='close-btn'>x</button>
            </div>
            <div className='node-content' >


                {renderNodeContent(name, content)}
            </div>
            {name !== 'intentModel' && <Handle type="source" position={Position.Right} id="b" />}
            <div className='action-btn-container'>
                <ButtonBase onClick={() => onConfigure(id, name, title, nodes, content)} className='configure-btn'>
                    <SettingsIcon style={{ height: 16 }} />
                </ButtonBase>
            </div>
        </div>
    )
}

export default CustomizedNode;