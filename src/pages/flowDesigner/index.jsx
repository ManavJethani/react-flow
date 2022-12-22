import React from 'react';
import SettingsDrawer from '../../components/configure';
import DnDFlow from '../../components/dndFlow';

const FlowDesigner = () => {
    const [openDrawer, setOpenDrawer] = React.useState(false)
    const [selectedId, setSelectedId] = React.useState(null)
    const [updateNode, setUpdatedNode] = React.useState([])

    const toggleDrawer = (open) => {
        setOpenDrawer(open);
    };

    const onSaveClick = (data) => {
        setUpdatedNode(prev => ({
            ...prev,
            id: data.id,
            title: data.title,
            content: data.content,
            name:data.name
        }))
        toggleDrawer(false)
    }

    const onConfigure = (id, name, title, nodes, content) => {
        setSelectedId({ id, name, title, nodes, content })
        toggleDrawer(true)
    }

    return (
        <>
            <SettingsDrawer
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                selectedId={selectedId}
                // nodes={nodes}
                onSaveClick={onSaveClick}
                updateIntent={onSaveClick}
            />
            <DnDFlow onConfigure={onConfigure} updateNode={updateNode} />
        </>
    );
};

export default FlowDesigner;
