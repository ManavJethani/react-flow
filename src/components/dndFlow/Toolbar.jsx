import React from "react";
import { FLOW_DESIGN_CONSTANT } from "../../constants";

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">{FLOW_DESIGN_CONSTANT.DRAG_AND_DROP}</div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "audioUpload")}
        draggable
      >
        {FLOW_DESIGN_CONSTANT.AUDIO_UPLOAD}
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "listen")}
        draggable
      >
        {FLOW_DESIGN_CONSTANT.LISTEN}
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "intentModel")}
        draggable
      >
        {FLOW_DESIGN_CONSTANT.INTENT_MODEL}
      </div>
    </aside>
  );
};
