import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { useNode } from "context/NodeContext";
import { TOverSampleType } from "utils/audioContext";

interface Options {
  curve?: Float32Array | null;
  oversample?: TOverSampleType;
}

function useWaveShaperNode(id: string, { curve = null, oversample = "none" }: Options) {
  // AudioNode
  const node = useNode(id, context => context.createWaveShaper());

  // AudioParam
  useImmediateUpdateEffect(() => void (node.curve = curve), [node, curve]);
  useImmediateUpdateEffect(() => void (node.oversample = oversample), [node, oversample]);

  return node;
}

export default useWaveShaperNode;
