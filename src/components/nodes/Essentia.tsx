import Node from "../Node";
import React, { useEffect } from "react";
import { NodeProps } from "react-flow-renderer";
import { useAudioContext } from "../../hooks/state/useAudioContext";
import { useNode } from "../../hooks/state/useNodeStore";
import useGainNode from "../../hooks/nodes/useGainNode";
import useAudioWorkletNode from "../../hooks/nodes/useAudioWorkletNode";

// TODO add peak hold
function EssentiaNode(props: NodeProps) {
  const context = useAudioContext();
  // const node = useAudioWorkletNode(id, "meter-processor", { numberOfOutputs: 0 });
    const { id, type } = props

  const node = useAudioWorkletNode(id, "essentia-processor", { numberOfOutputs: 1 });

  return (
    <Node id={id} inputs={["input"]} outputs={['output']} title="Essentia" type={type}>
      <div className="customNode_editor nodrag">
        <div className="customNode_item">
          {/* <canvas
            ref={canvasRef}
            width={DPI_RATIO * canvasWidth}
            height={DPI_RATIO * canvasHeight}
            style={{ height: canvasHeight, width: canvasWidth }}
          /> */}
        </div>
      </div>
    </Node>
  );
}

export default React.memo(EssentiaNode);
