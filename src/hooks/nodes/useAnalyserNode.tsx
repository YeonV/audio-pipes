import { useNode } from "context/NodeContext";
import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";

interface Options {
  fftSizeExp?: number;
}

function useAnalyserNode(id: string, { fftSizeExp = 11 }: Options) {
  // AudioNode
  const node = useNode(id, context => context.createAnalyser());

  // AudioParam
  useImmediateUpdateEffect(() => void (node.fftSize = Math.pow(2, fftSizeExp)), [node, fftSizeExp]);

  return node;
}

export default useAnalyserNode;
