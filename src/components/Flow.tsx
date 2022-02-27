import FlowContextMenu from "./FlowContextMenu";
import ADSR from "./nodes/ADSR";
import Analyser from "./nodes/Analyser";
import AndGate from "./nodes/AndGate";
import AudioBufferSource from "./nodes/AudioBufferSource";
import BiquadFilter from "./nodes/BiquadFilter";
import ChannelMerger from "./nodes/ChannelMerger";
import ChannelSplitter from "./nodes/ChannelSplitter";
import Clipper from "./nodes/Clipper";
import Comparator from "./nodes/Comparator";
import ConstantSource from "./nodes/ConstantSource";
import Delay from "./nodes/Delay";
import DelayEffect from "./nodes/DelayEffect";
import Destination from "./nodes/Destination";
import DynamicsCompressor from "./nodes/DynamicsCompressor";
import EnvelopeFollower from "./nodes/EnvelopeFollower";
import Equalizer from "./nodes/Equalizer";
import Gain from "./nodes/Gain";
import Gate from "./nodes/Gate";
import InputSwitch from "./nodes/InputSwitch";
import Keyboard from "./nodes/Keyboard";
import Meter from "./nodes/Meter";
import Metronome from "./nodes/Metronome";
import Noise from "./nodes/Noise";
import NotGate from "./nodes/NotGate";
import OrGate from "./nodes/OrGate";
import Oscillator from "./nodes/Oscillator";
import OscillatorNote from "./nodes/OscillatorNote";
import OutputSwitch from "./nodes/OutputSwitch";
import Quantizer from "./nodes/Quantizer";
import Rectifier from "./nodes/Rectifier";
import Aubio from "./nodes/Aubio";
import AudioDeviceSource from "./nodes/AudioDeviceSource";
import SampleAndHold from "./nodes/SampleAndHold";
import Sign from "./nodes/Sign";
import StereoPanner from "./nodes/StereoPanner";
import Transformer from "./nodes/Transformer";
import Vocoder from "./nodes/Vocoder";
import WaveShaper from "./nodes/WaveShaper";
import Wled from "./nodes/Wled";
import XorGate from "./nodes/XorGate";
import XYPad from "./nodes/XYPad";
import { useContextMenu } from "../context/ContextMenuContext";
import { useProject } from "../hooks/state/useProject";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Elements,
  isEdge,
  isNode,
  Node as ReactFlowNode,
  OnConnectStartParams,
  OnLoadParams as ReactFlowInstance,
  removeElements,
} from "react-flow-renderer";
import { useOnConnect, useOnEdgeRemove, useOnNodeRemove } from "../utils/handles";
import { v4 as uuidv4 } from "uuid";
import RawGain from "./nodes/RawGain";
import { AnyAudioNode, useNodeStore } from "../hooks/state/useNodeStore";

const nodeTypes = {
  ADSR: ADSR,
  Analyser: Analyser,
  AndGate: AndGate,
  Aubio: Aubio,
  AudioBufferSource: AudioBufferSource,
  AudioDeviceSource: AudioDeviceSource,
  BiquadFilter: BiquadFilter,
  ChannelMerger: ChannelMerger,
  ChannelSplitter: ChannelSplitter,
  Clipper: Clipper,
  Comparator: Comparator,
  ConstantSource: ConstantSource,
  Delay: Delay,
  DelayEffect: DelayEffect,
  Destination: Destination,
  DynamicsCompressor: DynamicsCompressor,
  EnvelopeFollower: EnvelopeFollower,
  Equalizer: Equalizer,
  Gain: Gain,
  Gate: Gate,
  InputSwitch: InputSwitch,
  Keyboard: Keyboard,
  Meter: Meter,
  Metronome: Metronome,
  Noise: Noise,
  NotGate: NotGate,
  OrGate: OrGate,
  Oscillator: Oscillator,
  OscillatorNote: OscillatorNote,
  OutputSwitch: OutputSwitch,
  Quantizer: Quantizer,
  RawGain: RawGain,
  Rectifier: Rectifier,
  SampleAndHold: SampleAndHold,
  Vocoder: Vocoder,
  Sign: Sign,
  StereoPanner: StereoPanner,
  Transformer: Transformer,
  WaveShaper: WaveShaper,
  Wled: Wled,
  XorGate: XorGate,
  XYPad: XYPad,
};

function getEdgeWithColor(params: Edge | Connection): Edge {
  if (!params.source) {
    return params as Edge;
  }

  return Object.assign({}, params, {
    style: {
      // stroke: '#0dbedc',
      stroke: `#0dbed${params.source.substr(-1)}`,
    },
  }) as Edge;
}

async function waitForInitialNodes(
  initialElements: Elements,
  audioNodes: Record<string, AnyAudioNode>
) {
  const nodesWithConnections = initialElements
    .filter(isEdge)
    .reduce<Record<string, boolean>>((nodeIds, edge) => {
      nodeIds[edge.source] = true;
      nodeIds[edge.target] = true;
      return nodeIds;
    }, {});
  while (Object.keys(nodesWithConnections).length) {
    Object.keys(audioNodes).forEach(nodeId => {
      delete nodesWithConnections[nodeId];
    });
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

export const GRID_SIZE = 10;

function snapToGrid(position: number) {
  return Math.floor(position / GRID_SIZE) * GRID_SIZE;
}

function Flow() {
  const { elements, onChangeElementFactory, setElements, setTransform, transform, addElement } =
    useProject();
  const contextMenu = useContextMenu();
  const { nodes: audioNodes } = useNodeStore();
  const [tryingToConnect, setTryingToConnect] = useState<OnConnectStartParams | null>(null);

  const onElementsConnect = useOnConnect();
  const onEdgeRemove = useOnEdgeRemove();
  const onNodeRemove = useOnNodeRemove();

  const onLoad = useCallback(
    async (reactFlowInstance: ReactFlowInstance) => {
      reactFlowInstance.setTransform(transform);

      // Attach onChange to nodes
      setElements(
        elements.map(node => {
          if (isNode(node)) {
            return {
              ...node,
              data: {
                ...node.data,
                onChange: onChangeElementFactory(node.id),
              },
            };
          }
          return node;
        })
      );

      // Wait for nodes to render and handle connections
      // FIXME This should be handled on changes to ReactFlowRenderer state instead.
      await waitForInitialNodes(elements, audioNodes);
      const edges = elements.filter(isEdge);
      edges.forEach(edge => onElementsConnect(edge));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onMoveEnd = useCallback(
    transform => {
      setTransform(transform);
    },
    [setTransform]
  );

  const onConnectStart = useCallback((e: React.MouseEvent, params: OnConnectStartParams) => {
    setTryingToConnect(params);
  }, []);
  const onConnectStop = useCallback((e: MouseEvent) => setTryingToConnect(null), []);
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setElements(addEdge(getEdgeWithColor(params), elements));
      onElementsConnect(params);
    },
    [onElementsConnect, setElements, elements]
  );
  const onElementsRemove = useCallback(
    (elementsToRemove: Elements) => {
      elementsToRemove.filter(isEdge).forEach(edge => onEdgeRemove(edge));
      elementsToRemove.filter(isNode).forEach(node => onNodeRemove(node.id));

      setElements(removeElements(elementsToRemove, elements));
    },
    [onEdgeRemove, onNodeRemove, setElements, elements]
  );
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      onEdgeRemove(oldEdge);
      setElements(removeElements([oldEdge], elements));
      setElements(addEdge(getEdgeWithColor(newConnection), elements));
      onElementsConnect(newConnection);
    },
    [onEdgeRemove, onElementsConnect, setElements, elements]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>, draggedNode: ReactFlowNode) => {
      setElements(
        elements.map(element => {
          if (isNode(element) && element.id === draggedNode.id) {
            return {
              ...element,
              position: {
                x: snapToGrid(draggedNode.position.x),
                y: snapToGrid(draggedNode.position.y),
              },
            };
          }
          return element;
        })
      );
    },
    [setElements, elements]
  );

  const addNode = useCallback(
    (type: string) => {
      const id = `${type}-${uuidv4()}`;
      const onChange = onChangeElementFactory(id);
      const position = {
        x: snapToGrid((contextMenu.getRect().left - transform.x) / transform.zoom),
        y: snapToGrid((contextMenu.getRect().top - transform.y) / transform.zoom),
      };
      addElement({
        id,
        data: { onChange },
        type,
        position,
      });
      contextMenu.hide();
    },
    [contextMenu, onChangeElementFactory, transform, addElement]
  );

  const onPaneClick = useCallback(() => {
    contextMenu.hide();
  }, [contextMenu]);

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      contextMenu.setRect({
        width: 0,
        height: 0,
        top: event.clientY,
        right: 0,
        bottom: 0,
        left: event.clientX,
      } as DOMRect);
      contextMenu.show(<FlowContextMenu addNode={addNode} />);
    },
    [addNode, contextMenu]
  );

  return (
    <>
      <ReactFlow
        data-connecting-handletype={tryingToConnect ? tryingToConnect.handleType : undefined}
        defaultPosition={[transform.x, transform.y]}
        defaultZoom={transform.zoom}
        elements={elements}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectStop={onConnectStop}
        onEdgeUpdate={onEdgeUpdate}
        onElementsRemove={onElementsRemove}
        onLoad={onLoad}
        onMoveEnd={onMoveEnd}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onlyRenderVisibleElements={false}
        selectNodesOnDrag={false}
        snapToGrid
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        // TODO figure out why this is needed for flow container not to cover context menu
        style={{ zIndex: 0 }}
      >
        <Background gap={GRID_SIZE} />
        <Controls />
      </ReactFlow>
    </>
  );
}

export default React.memo(Flow);
