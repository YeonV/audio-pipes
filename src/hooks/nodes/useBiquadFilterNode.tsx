import { useNode } from "context/NodeContext";
import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { TBiquadFilterType } from "utils/audioContext";

interface Options {
  detune?: number;
  frequency?: number;
  gain?: number;
  Q?: number;
  type?: TBiquadFilterType;
}

function useBiquadFilterNode(
  id: string,
  { detune = 0, frequency = 350, gain = 0, Q = 1, type = "lowpass" }: Options
) {
  // AudioNode
  const node = useNode(id, context => context.createBiquadFilter());

  // AudioParam
  useImmediateUpdateEffect(() => void (node.detune.value = detune), [node, detune]);
  useImmediateUpdateEffect(() => void (node.frequency.value = frequency), [node, frequency]);
  useImmediateUpdateEffect(() => void (node.gain.value = gain), [node, gain]);
  useImmediateUpdateEffect(() => void (node.Q.value = Q), [node, Q]);
  useImmediateUpdateEffect(() => void (node.type = type), [node, type]);

  return node;
}

export default useBiquadFilterNode;
