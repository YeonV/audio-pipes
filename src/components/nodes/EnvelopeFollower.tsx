import Node from "components/Node";
import { useNode } from "context/NodeContext";
import useAudioWorkletNode from "hooks/nodes/useAudioWorkletNode";
import React, { useEffect } from "react";
import { NodeProps } from "react-flow-renderer";
import { ParameterDefaults, Parameters } from "worklets/envelope-follower.types";

interface EnvelopeFollowerNode {
  [Parameters.AttackTime]: AudioParam;
  [Parameters.ReleaseTime]: AudioParam;
}

function EnvelopeFollower({ id, type, data, selected }: NodeProps) {
  const { attack = ParameterDefaults.attack, release = ParameterDefaults.release, onChange } = data;

  const workletId = `worklet_${id}`;
  const workletNode = useAudioWorkletNode(workletId, "envelope-follower");
  const node = useNode(
    id,
    () => ({
      [Parameters.AttackTime]: workletNode.parameters.get(Parameters.AttackTime),
      [Parameters.ReleaseTime]: workletNode.parameters.get(Parameters.ReleaseTime),
      input: workletNode,
      output: workletNode,
    }),
    [workletNode]
  ) as EnvelopeFollowerNode;

  // AudioParam
  useEffect(() => void (node[Parameters.AttackTime].value = attack), [node, attack]);
  useEffect(() => void (node[Parameters.ReleaseTime].value = release), [node, release]);

  return (
    <Node
      id={id}
      inputs={["input", Parameters.AttackTime, Parameters.ReleaseTime]}
      outputs={["output"]}
      title="Envelope Follower"
      type={type}
    >
      {selected && (
        <div className="customNode_editor nodrag">
          <div className="customNode_item">
            <input
              min={0}
              onChange={e => onChange({ [Parameters.AttackTime]: +e.target.value })}
              step={0.05}
              style={{ width: "50%" }}
              title="Attack time"
              type="number"
              value={attack}
            />
          </div>
          <div className="customNode_item">
            <input
              min={0}
              onChange={e => onChange({ [Parameters.ReleaseTime]: +e.target.value })}
              step={0.05}
              style={{ width: "50%" }}
              title="Release time"
              type="number"
              value={release}
            />
          </div>
        </div>
      )}
    </Node>
  );
}

export default React.memo(EnvelopeFollower);
