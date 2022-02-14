import NumericStepper from "components/controls/NumericStepper";
import Node from "components/Node";
import useGainNode from "hooks/nodes/useGainNode";
import React from "react";
import { NodeProps } from "react-flow-renderer";

function RawGain({ data, id, selected, type: nodeType }: NodeProps) {
  const { gain = 1, onChange } = data;
  const title = `Gain: ${gain.toFixed(2)}`;
  useGainNode(id, { gain, instant: true });

  return (
    <Node id={id} inputs={["input", "gain"]} outputs={["output"]} title={title} type={nodeType}>
      {selected && (
        <div className="customNode_editor nodrag">
          <div className="customNode_item">
            <NumericStepper value={gain} onChange={gain => onChange({ gain })} />
          </div>
        </div>
      )}
    </Node>
  );
}

export default React.memo(RawGain);
