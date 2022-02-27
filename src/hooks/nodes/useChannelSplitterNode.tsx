import { useNode } from "../../hooks/state/useNodeStore";

interface Options {
  outputs?: number;
}

function useChannelSplitterNode(id: string, { outputs = 2 }: Options) {
  // AudioNode
  return useNode(id, context => context.createChannelSplitter(outputs), [outputs]);
}

export default useChannelSplitterNode;
