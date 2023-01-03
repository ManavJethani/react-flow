import React from 'react';
import { useRef } from 'react';
import SettingsDrawer from '../../components/configure';
import DnDFlow from '../../components/dndFlow';

let id = new Date()
const getId = () => `int_${++id}`;
const getAudioId = () => `audio_${++id}`;

const FlowDesigner = () => {
    const [openDrawer, setOpenDrawer] = React.useState(false)
    const [selectedId, setSelectedId] = React.useState(null)
    const [updateNode, setUpdatedNode] = React.useState([])
    const [selectedIntent, setSelectedIntent] = React.useState([])
    const [intentLibrary, setIntentLibrary] = React.useState([
        {
            id: getId(),
            intentName: "I am doing good",
            utterances: [
                "good", "great"
            ]
        },
        {
            id: getId(),
            intentName: "Bad Experience",
            utterances: [
                "Bad", "Worse"
            ]
        }
    ]);
    const [audioLibrary, setAudioLibrary] = React.useState([
        {
            id: getAudioId(),
            audioName: "audio file 1",
            url: '',
            type: 'audio'
        },
        {
            id: getAudioId(),
            audioName: "audio file 2",
            url: '',
            type: 'audio'
        }
    ]);
    const [selectedAudio, setSelectedAudio] = React.useState([])


    const toggleDrawer = (open) => {
        setOpenDrawer(open);
    };

    const handleUpdateNode = (data, toggle = false) => {
        setSelectedIntent([])
        setSelectedAudio([])
        setUpdatedNode(prev => ({
            ...prev,
            id: data.id,
            title: data.title,
            content: data.content,
            name: data.name
        }))
        toggleDrawer(toggle)
    }

    const onConfigure = (id, name, title, nodes, content) => {
        setSelectedId({ id, name, title, nodes, content })
        toggleDrawer(true)
    }

    const updateIntentList = (intents) => {
        setSelectedIntent(intents)
    }

    const updateIntentLibrary = (intents) => {
        setIntentLibrary(intents)
    }

    const updateAudioLibrary = (audio) => {
        setAudioLibrary(audio)
    }

    const updateAudioList = (audio) => {
        setSelectedAudio(audio)
    }

    return (
        <>
            <SettingsDrawer
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                selectedId={selectedId}
                onSaveClick={handleUpdateNode}
                updateIntent={handleUpdateNode}
                intentLibrary={intentLibrary}
                selectedIntent={selectedIntent}
                updateIntentList={updateIntentList}
                updateIntentLibrary={updateIntentLibrary}
                updateAudioLibrary={updateAudioLibrary}
                updateAudioList={updateAudioList}
                selectedAudio={selectedAudio}
                audioLibrary={audioLibrary}
            />
            <DnDFlow onConfigure={onConfigure} updateNode={updateNode} />
        </>
    );
};

export default FlowDesigner;
