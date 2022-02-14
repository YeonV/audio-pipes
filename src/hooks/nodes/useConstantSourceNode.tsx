import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { useNode } from "context/NodeContext";

interface Options {
  offset?: number;
}

function useConstantSourceNode(id: string, { offset = 0 }: Options) {
  // AudioNode
  const node = useNode(id, context => context.createConstantSource());
  useImmediateUpdateEffect(() => {
    node.start();
    return () => node.stop();
  }, [node]);

  // AudioParam
  useImmediateUpdateEffect(() => void (node.offset.value = offset), [node, offset]);

  return node;
}

export default useConstantSourceNode;
