import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { useNode } from "context/NodeContext";

interface Options {
  delayTime?: number;
  maxDelayTime?: number;
}

function useDelayNode(id: string, { delayTime = 1, maxDelayTime = 1 }: Options) {
  // AudioNode
  const node = useNode(id, context => context.createDelay(maxDelayTime), [maxDelayTime]);

  // AudioParam
  useImmediateUpdateEffect(() => void (node.delayTime.value = delayTime), [node, delayTime]);

  return node;
}

export default useDelayNode;
