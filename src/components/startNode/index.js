import React from 'react'
import './style.css'
import { Handle, Position } from 'reactflow';

const StartNode = () => {
    return <div className='initial-node'>
        <span className='title'>Start</span>
        <Handle type="source" position={Position.Right} id="a" />
    </div>
}

export default StartNode;