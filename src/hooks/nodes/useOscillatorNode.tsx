import useImmediateUpdateEffect from "hooks/useImmediateUpdateEffect";
import { useNode } from "context/NodeContext";
import { useEffect } from "react";
import { TOscillatorType } from "utils/audioContext";

interface Options {
  detune?: number;
  frequency?: number;
  type?: TOscillatorType;
}

function useOscillatorNode(id: string, { detune = 0, frequency = 440, type = "sine" }: Options) {
  // AudioNode
  const node = useNode(id, context => context.createOscillator());
  useEffect(() => {
    node.start();
    return () => node.stop();
  }, [node]);

  // AudioParam
  useImmediateUpdateEffect(() => void (node.detune.value = detune), [node, detune]);
  useImmediateUpdateEffect(() => void (node.frequency.value = frequency), [node, frequency]);
  useImmediateUpdateEffect(() => void (node.type = type), [node, type]);

  return node;
}

export default useOscillatorNode;
