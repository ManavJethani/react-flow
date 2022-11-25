import React from 'react';
import './style.css'
import { Handle, Position } from 'reactflow';
import closeIcon from '../../assets/images/icons8-macos-close-30.png';

const CustomizedNode = ({ title, content, id, handleDelete }) => {

    const onDelete = (id) => {
        handleDelete(id)
    }

    return (
        <div className='node-container'>
            <div className='heading-container'>
                <Handle type="input" position={Position.Top} id="a" />
                <h3 className='node-title'>{title}</h3>
                <button onClick={() => onDelete(id)} className='close-btn'>x</button>
            </div>
            <div className='node-content'>
                <span>
                    {content}
                </span>
            </div>
            <Handle type="input" position={Position.Bottom} id="b" />
        </div>
    )
}

export default CustomizedNode;