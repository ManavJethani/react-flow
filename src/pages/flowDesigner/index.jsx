import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    updateEdge,
    ConnectionMode
} from 'reactflow';
import 'reactflow/dist/style.css';

import './style.css';
import Toolbar from './Toolbar';
import AudioUpload from '../../components/audio'
import IntentModel from '../../components/intentModel';
import Listen from '../../components/listen';
import StartNode from '../../components/startNode';

const initialNodes = [
    { id: 'A', type: 'startNode', position: { x: 0, y: 10 }, data: { value: 123 } },
];

const nodeTypes = {
    audioUpload: AudioUpload,
    intentModel: IntentModel,
    listen: Listen,
    startNode: StartNode
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const edgeUpdateSuccessful = useRef(true);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            let type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            let newNode = {}
            let id = getId()
            newNode = {
                id,
                type,
                position,
                data: { label: `${type} node-${id}`, id: id, handleDelete: handlDelete },
            };
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    const handlDelete = (e) => {
        console.log('checking handle delete', e)
        setNodes((nds) =>
            nds.filter((node) => {
                console.log('check node in filter',node)

                return node.id !== e;
            })
        );
    }

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    // const checkType = (type) => {

    // }

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <Toolbar />
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                        nodeTypes={nodeTypes}
                        onEdgeUpdate={onEdgeUpdate}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={onEdgeUpdateEnd}
                        connectionMode={ConnectionMode.Loose}
                    >
                        <Controls>
                        </Controls>
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default DnDFlow;
