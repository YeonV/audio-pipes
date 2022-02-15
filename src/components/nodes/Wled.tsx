import React from "react";
import { NodeProps } from "react-flow-renderer";
import Node from "components/Node";

function Wled({ id, type, selected }: NodeProps) {
  return (
    <Node id={id} inputs={["input"]} type={type} title={`WLED: ${id.substring(0, 11)}`}>
      {selected && (
        <div className="customNode_editor nodrag">
          <div className="customNode_item">
            <input type="text" title="Host" />
          </div>
        </div>
      )}
    </Node>
  );
}

export default React.memo(Wled);
