import { DependencyList } from "react";
import { useNode } from "context/NodeContext";
import { AudioWorkletNode, IAudioWorkletNodeOptions } from "utils/audioContext";

function useAudioWorkletNode(
  id: string,
  name: string,
  options?: Partial<IAudioWorkletNodeOptions>,
  dependencies?: DependencyList
) {
  return useNode(
    id,
    context => {
      return new AudioWorkletNode!(context, name, {
        ...options,
        processorOptions: {
          ...options?.processorOptions,
          id,
        },
      });
    },
    dependencies
  );
}

export default useAudioWorkletNode;
