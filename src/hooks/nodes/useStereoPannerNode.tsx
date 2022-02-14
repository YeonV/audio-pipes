import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { useNode } from "context/NodeContext";

interface Options {
  pan?: number;
}

function useStereoPannerNode(id: string, { pan = 0 }: Options) {
  // AudioNode
  const node = useNode(id, context => context.createStereoPanner());

  // AudioParam
  useImmediateUpdateEffect(() => void (node.pan.value = pan), [node, pan]);

  return node;
}

export default useStereoPannerNode;
