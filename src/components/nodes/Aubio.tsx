import React from "react";
import { NodeProps } from "react-flow-renderer";
import Node from "components/Node";
import useAudioWorkletNode from "hooks/nodes/useAudioWorkletNode";
import { Mode } from "worklets/aubio-processor.types";

function Aubio({ data, id, selected, type }: NodeProps) {
  const { levels = 256, max = 1, min = -1, onChange, mode = Mode.OnSet } = data;
  useAudioWorkletNode(id, "quantizer-processor", { processorOptions: { levels, max, min } }, [
    levels,
    max,
    min,
  ]);

  return (
    <Node
      id={id}
      inputs={["input"]}
      outputs={["output", mode]}
      title={`Aubio: ${mode}`}
      type={type}
    >
      {selected && (
        <div className="customNode_editor nodrag">
          <div className="customNode_item" style={{ width: 138 }}>
            <select
              style={{ width: "100%" }}
              onChange={e => onChange({ mode: e.target.value })}
              title="Type"
              value={mode}
            >
              <option value={Mode.OnSet}>{Mode.OnSet}</option>
              <option value={Mode.Bpm}>{Mode.Bpm}</option>
              <option value={Mode.Pitch}>{Mode.Pitch}</option>
            </select>
          </div>
          {/* <div className="customNode_item" style={{ width: 138 }}>
            <input
              onChange={e => onChange({ levels: +e.target.value })}
              step={1}
              title="Levels"
              type="number"
              value={levels}
            />
          </div>
          <div className="customNode_item" style={{ width: 138 }}>
            <input
              onChange={e => onChange({ min: +e.target.value })}
              step={1}
              style={{ width: "50%" }}
              title="Min"
              type="number"
              value={min}
            />
            <input
              onChange={e => onChange({ max: +e.target.value })}
              style={{ width: "50%" }}
              step={1}
              title="Max>"
              type="number"
              value={max}
            />
          </div> */}
        </div>
      )}
    </Node>
  );
}

export default React.memo(Aubio);
