import { useNode } from "hooks/state/useNodeStore";

function useDestinationNode(id: string) {
  // AudioNode
  return useNode(id, context => context.destination);
}

export default useDestinationNode;
