import { DependencyList, useEffect, useMemo } from "react";
import { useStoreState } from "react-flow-renderer";
import { AudioContext, AudioNode } from "../../utils/audioContext";
import { connectNodes, disconnectNodes } from "../../utils/handles";
import { useAudioContext } from "./useAudioContext";
import create from "zustand";
import { devtools } from 'zustand/middleware'

export type ComplexAudioNode<
  Input extends AudioNode | undefined,
  Output extends AudioNode | undefined
> = {
  input?: Input;
  output?: Output;
};

export type AnyAudioNode = AudioNode | ComplexAudioNode<AudioNode, AudioNode>;

export type NodeContextType = {
  addNode: (id: string, node: AnyAudioNode) => void;
  getNode: (id: string) => AnyAudioNode;
  nodes: Record<string, AnyAudioNode>;
  removeNode: (id: string) => void;
};

interface NodeFactory<T> {
  (context: AudioContext): T;
}

interface ComplexNodeFactory<
  Input extends AudioNode | undefined,
  Output extends AudioNode | undefined
> {
  (context: AudioContext): ComplexAudioNode<Input, Output>;
}

export function isComplexAudioNode(
  node: AnyAudioNode
): node is ComplexAudioNode<AudioNode, AudioNode> {
  return node && "input" in node && "output" in node;
}

export function nodeCleanup(node: AnyAudioNode) {
  if (isComplexAudioNode(node)) {
    (node.input as any)?.stop?.();
    (node.output as any)?.stop?.();
    node.input?.disconnect();
    node.output?.disconnect();
  } else {
    (node as any).stop?.();
    node.disconnect();

    if (node instanceof AudioWorkletNode!) {
      node.port.postMessage("stop");
    }
  }
}

export const useNodeStore = create<NodeContextType>(devtools((set, get) => ({
  nodes: {},
  addNode: (id, node) => {
    set(state => ({
      ...state,
      nodes: {
        ...state.nodes,
        [id]: node,
      },
    }));
  },
  getNode: id => get().nodes[id],
  removeNode: id => {
    nodeCleanup(get().nodes[id]);
    set(state => ({
      nodes: Object.fromEntries(Object.entries(state.nodes).filter(([key]) => key === id)),
    }));
  },
})));

export function useNode<T extends AudioNode>(
  id: string,
  nodeFactory: NodeFactory<T>,
  dependencies?: DependencyList
): T;

export function useNode<Input extends AudioNode | undefined, Output extends AudioNode | undefined>(
  id: string,
  nodeFactory: ComplexNodeFactory<Input, Output>,
  dependencies?: DependencyList
): ComplexAudioNode<Input, Output>;

export function useNode(
  id: string,
  nodeFactory: ComplexNodeFactory<AudioNode, AudioNode>,
  dependencies: DependencyList = []
) {
  const { audioContext } = useAudioContext();
  const { addNode, getNode, removeNode } = useNodeStore();
  const edges = useStoreState(store => store.edges);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const node = useMemo(() => nodeFactory(audioContext), dependencies);

  useEffect(() => {
    addNode(id, node);

    // try reconnecting
    const edgesToConnect = edges.filter(edge => edge.source === id || edge.target === id);
    edgesToConnect.forEach(edge => connectNodes(edge, getNode));

    return () => {
      edgesToConnect.forEach(edge => disconnectNodes(edge, getNode));
      removeNode(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNode, getNode, node, id, removeNode]);

  return node;
}
