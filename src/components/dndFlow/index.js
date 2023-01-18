import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  updateEdge,
  ConnectionMode,
  ConnectionLineType,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import "./style.css";
import Toolbar from "./Toolbar";
import StartNode from "../../components/startNode";
import CustomizedNode from "../../components/customizedNode";
import { Button } from "@mui/material";

const initialNodes = [
  {
    id: "A",
    type: "startNode",
    position: { x: 0, y: 10 },
    data: { value: 123 },
  },
];

const nodeTypes = {
  startNode: StartNode,
  customNode: CustomizedNode,
};

let id = new Date();
const getId = () => `dndnode_${++id}`;

const DnDFlow = (props) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);

  useEffect(() => {
    if (props.updateNode.id) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === props.updateNode.id) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            node.data = {
              ...node.data,
              title: props.updateNode.title,
              content: props.updateNode.content,
            };
          }

          return node;
        })
      );
    }
  }, [props.updateNode]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      let name = event.dataTransfer.getData("application/reactflow");

      let type = "customNode";

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      let newNode = {};
      newNode = {
        id: getId(),
        type,
        position,
        data: addNode(name, id),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const handleDelete = (e) => {
    setNodes((nds) =>
      nds.filter((node) => {
        return node.id !== e;
      })
    );
  };

  const addNode = (name, id) => {
    switch (name) {
      case "audioUpload":
        return {
          id: `dndnode_` + id,
          name,
          title: "Audio Upload",
          content: "Audio File.mp3",
          handleDelete,
          onConfigure: props.onConfigure,
          nodes: nodes,
        };
      case "intentModel":
        return {
          id: `dndnode_` + id,
          name,
          title: "Intent Model",
          content: {
            intents: [],
          },
          handleDelete,
          onConfigure: props.onConfigure,
          nodes: nodes,
          // nodeType: 'group',
          style: {
            width: 170,
            height: 140,
          },
        };
      case "listen":
        return {
          id: `dndnode_` + id,
          name,
          title: "Listen",
          content: "Connect to Intent Model",
          handleDelete,
          onConfigure: props.onConfigure,
          nodes: nodes,
        };
      default:
        break;
    }
  };

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

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("flowKey", JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem("flowKey"));
      if (flow) {
        let newNodes = flow.nodes.map((node) => {
          node.data = {
            ...node.data,
            handleDelete,
            onConfigure: props.onConfigure,
          };
          return node;
        });
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(newNodes || []);
        setEdges(flow.edges || []);
        // setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes]);

  return (
    <>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <Toolbar />
            <div style={{ width: "100%" }}>
              <header className="header-container">
                <span>Title</span>
                <div>
                  <Button onClick={onSave}>Save</Button>
                  <Button onClick={onRestore} variant="contained">
                    Restore
                  </Button>
                </div>
              </header>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                // fitView
                nodeTypes={nodeTypes}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                // connectionMode={ConnectionMode.Loose}
                className="flow-container"
                connectionLineType={ConnectionLineType.SmoothStep}
                defaultEdgeOptions={{
                  type: ConnectionLineType.SmoothStep,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                  },
                  style: {
                    strokeWidth: 2,
                  },
                }}
              >
                <Controls></Controls>
              </ReactFlow>
            </div>
          </div>
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default DnDFlow;
