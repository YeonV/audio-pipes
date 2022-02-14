import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { useNode } from "context/NodeContext";

interface Options {
  attack?: number;
  knee?: number;
  ratio?: number;
  release?: number;
  threshold?: number;
}

function useDynamicsCompressorNode(
  id: string,
  { attack = 0.003, knee = 30, ratio = 12, release = 0.25, threshold = -24 }: Options
) {
  // AudioNode
  const node = useNode(id, context => context.createDynamicsCompressor());

  // AudioParam
  useImmediateUpdateEffect(() => void (node.threshold.value = threshold), [node, threshold]);
  useImmediateUpdateEffect(() => void (node.knee.value = knee), [node, knee]);
  useImmediateUpdateEffect(() => void (node.ratio.value = ratio), [node, ratio]);
  useImmediateUpdateEffect(() => void (node.attack.value = attack), [node, attack]);
  useImmediateUpdateEffect(() => void (node.release.value = release), [node, release]);

  return node;
}

export default useDynamicsCompressorNode;
