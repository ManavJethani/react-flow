import React from 'react';
import ReactFlow, { Handle, Position } from 'reactflow'; 

const IntentModel = () => {
    return (
        <div className='node-container'>
            <h3 className='node-title'>Intent Model</h3>
            {/* <Handle type="group" position={Position.Top} id="a" /> */}
            <div className='node-content'>
                {/* <CustomNodes nodes={nodes}/> */}
                some data
            </div>
            <Handle type="source" position={Position.Right} id="b" />
        </div>
    )
}

export default IntentModel;