import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Drag and drop</div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'audioUpload')} draggable>
        Audio Upload
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'listen')} draggable>
        Listen
      </div>
    </aside>
  );
};
