/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Node from "components/Node";
import { nodeCleanup } from "components/Nodes";
import { useNode } from "context/NodeContext";
import useAnalyserNode from "hooks/nodes/useAnalyserNode";
import useAudioWorkletNode from "hooks/nodes/useAudioWorkletNode";
import useBiquadFilterNode from "hooks/nodes/useBiquadFilterNode";
import useGainNode from "hooks/nodes/useGainNode";
import useAnimationFrame from "hooks/useAnimationFrame";
import produce from "immer";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NodeProps } from "react-flow-renderer";
import { generate, generateArray, zip } from "utils/collections";
import { noop } from "utils/functions";
import { dbToFloat32 } from "utils/units";
import { Parameters } from "worklets/envelope-follower.types";
import { BandStrip } from "./BandStrip";
import color from "color";
import { BandResponse, BandStyle, FilterDescription } from "./types";
import "./Vocoder.css";

const FFT_SIZE = 1024;
const FFT_SIZE_EXP = Math.log2(FFT_SIZE);
const BIN_COUNT = FFT_SIZE / 2;

const RESPONSE_STEPS = 240;
const MIN_HZ = 0;
const MAX_HZ = 4000;

const FILTER_BANDS: FilterDescription[] = [
  { hz: 101, type: "lowpass", gainDb: -2.55, q: 0.55 },
  { hz: 154, type: "bandpass", gainDb: -2.4, q: 2.96 },
  { hz: 208, type: "bandpass", gainDb: -2.4, q: 4 },
  { hz: 285, type: "bandpass", gainDb: -3, q: 3.55 },
  { hz: 395, type: "bandpass", gainDb: -2.5, q: 3.7 },
  { hz: 542, type: "bandpass", gainDb: -3.12, q: 3.75 },
  { hz: 720, type: "bandpass", gainDb: -2.8, q: 3.7 },
  { hz: 1013, type: "bandpass", gainDb: -2.8, q: 3.9 },
  { hz: 1495, type: "bandpass", gainDb: -3.4, q: 3.2 },
  { hz: 2001, type: "bandpass", gainDb: -3.15, q: 5.16 },
  { hz: 2546, type: "bandpass", gainDb: -2.8, q: 4.48 },
  { hz: 3030, type: "highpass", gainDb: -2, q: 0.88 },
];

export function Vocoder({ id, type }: NodeProps) {
  // Input/output nodes
  const modInputNode = useGainNode(`${id}_modulate`, {});
  const modAnalyser = useAnalyserNode(`${id}_modulate_analyser`, { fftSizeExp: FFT_SIZE_EXP });
  const carrierInputNode = useGainNode(`${id}_carrier`, {});
  const outputNode = useGainNode(`${id}_output`, {});

  // Modulator bank configuration
  const [modConfig, setModConfig] = useState(produce(FILTER_BANDS, noop));

  // Whether the graph is connected to its inputs
  const [paused, setPaused] = useState(false);

  // The number of samples per second
  const sampleRate = modInputNode.context.sampleRate;

  // Construct the nodes that make up the modulator's filter bank
  const modFilterBank = modConfig.map(({ hz, type, gainDb, q }) => {
    // While illegal by rules of hooks, the bands array is never rearranged in
    // runtime so hook call order is preserved
    const gainNode = useGainNode(`${id}_modulate_gain_${hz}`, {
      gain: dbToFloat32(gainDb),
      instant: true,
    });

    const biquadNode = useBiquadFilterNode(`${id}_modulate_filter1_${hz}`, {
      frequency: hz,
      gain: 0,
      type,
      Q: q,
    });

    const envelopeFollower = useAudioWorkletNode(
      `${id}_modulate_envelope_${hz}`,
      "envelope-follower",
      {
        parameterData: {
          [Parameters.AttackTime]: 0,
          [Parameters.ReleaseTime]: 0.0003,
        },
      }
    );

    return {
      filter: biquadNode,
      gain: gainNode,
      envelopeFollower: envelopeFollower,
    };
  });

  // Calculate filter responses
  const responsesByBand = new Map<number, BandResponse>();
  const stepCount = RESPONSE_STEPS;
  const stepSize = (MAX_HZ - MIN_HZ) / stepCount;
  const freqs = Float32Array.from(generate(stepCount, i => i * stepSize + MIN_HZ));

  for (let i = 0; i < modConfig.length; i++) {
    const bandResponse = useMemo(() => {
      const { filter, gain } = modFilterBank[i];

      const magResponse = new Float32Array(freqs.length);
      const phaseResponse = new Float32Array(freqs.length);

      filter.getFrequencyResponse(freqs, magResponse, phaseResponse);
      const gainAdjustedMagResponse = magResponse.map(mag => mag * gain.gain.value);

      return {
        frequencies: freqs,
        magResponse: gainAdjustedMagResponse,
        phaseResponse,
      };
    }, [modConfig[i]]);

    responsesByBand.set(modConfig[i].hz, bandResponse);
  }

  const carrierFilterBank = modConfig.map(({ hz, type, q }) => {
    // While illegal by rules of hooks, the bands array is never changed in
    // runtime so hook call order is preserved
    const filterNode1 = useBiquadFilterNode(`${id}_carrier_filter1_${hz}`, {
      frequency: hz,
      gain: 0,
      type,
      Q: q,
    });
    const filterNode2 = useBiquadFilterNode(`${id}_carrier_filter2_${hz}`, {
      frequency: hz,
      gain: 0,
      type,
      Q: q,
    });

    const gainNode = useGainNode(`${id}_carrier_gain_${hz}`, {
      gain: 0,
      instant: true,
    });

    const analyserNode = useAnalyserNode(`${id}_carrier_analyser_${hz}`, {
      fftSizeExp: FFT_SIZE_EXP,
    });

    return {
      filter1: filterNode1,
      filter2: filterNode2,
      gain: gainNode,
      analyser: analyserNode,
    };
  });

  useEffect(
    () => {
      modInputNode.connect(modAnalyser);

      for (const { gain, filter, envelopeFollower } of modFilterBank) {
        // Connect up the chain
        const binModulatorNodes = [filter, gain, envelopeFollower];
        binModulatorNodes.reduce((acc, node) => {
          return acc ? (node ? acc.connect(node) : acc) : node;
        });
      }

      for (const [i, { filter1, filter2, gain, analyser }] of carrierFilterBank.entries()) {
        const binCarrierNodes = [filter1, filter2, gain, analyser];

        // Connect up the chain
        binCarrierNodes.reduce((acc, node) => {
          return !!acc ? (node ? acc.connect(node) : acc) : node;
        });

        // Modulate the carrier gain from the equivalent modulation node
        modFilterBank[i].envelopeFollower.connect(gain.gain);

        // And connect the carrier to the output
        gain.connect(outputNode);
      }
    },
    // We use a constant, because there's no reason for this to change at runtime,
    // and spreading out all the nodes into a list seems so wasteful.
    [outputNode]
  );

  // Connect or disconnect from input when `active` changes
  useEffect(() => {
    for (const { filter } of modFilterBank) {
      // Connect to the modulator
      if (paused) modInputNode.disconnect(filter);
      else modInputNode.connect(filter);
    }

    for (const { filter1 } of carrierFilterBank) {
      // Connect the carrier to the chain
      if (paused) carrierInputNode.disconnect(filter1);
      else carrierInputNode.connect(filter1);
    }
  }, [paused]);

  useNode(
    id,
    () => ({
      carrier: carrierInputNode,
      modulation: modInputNode,
      input: undefined,
      output: outputNode,
      stop() {},
      disconnect() {
        nodeCleanup(carrierInputNode);
        nodeCleanup(modInputNode);
        nodeCleanup(outputNode);
      },
    }),
    [carrierInputNode, modInputNode, outputNode]
  );

  // Draw frequency response changes
  const freqResponseCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = freqResponseCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    drawFrequencyResponse(context, responsesByBand, { min: MIN_HZ, max: MAX_HZ });
  }, [responsesByBand]);

  const carrierBandBins = useRef([] as { frequency: number; freqBins: Uint8Array }[]);
  const carrierAnalyserCanvasRef = useRef<HTMLCanvasElement>(null);

  const getFrequencyData = useCallback(() => {
    const filtersFrequencies = generateArray(FILTER_BANDS.length, i => {
      const freqBins = new Uint8Array(BIN_COUNT);
      const analyserNode = carrierFilterBank[i].analyser!;
      analyserNode.getByteFrequencyData(freqBins);
      return { frequency: FILTER_BANDS[i].hz, freqBins };
    });

    carrierBandBins.current = filtersFrequencies;
    return sampleRate;
  }, [sampleRate, ...carrierFilterBank]);

  const draw = useCallback((sampleRate: number) => {
    const canvas = carrierAnalyserCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    drawBinsAsLine(context, carrierBandBins.current, {
      sampleRate: sampleRate,
      min: MIN_HZ,
      max: MAX_HZ,
    });
  }, []);

  const tick = useCallback(() => {
    const sampleRate = getFrequencyData();
    draw(sampleRate);
  }, [draw, getFrequencyData]);

  useAnimationFrame(tick, !paused);

  return (
    <Node
      id={id}
      inputs={["carrier", "modulation"]}
      outputs={["output"]}
      title="Vocoder"
      type={type}
    >
      <div className="vocoderNode_canvasHost">
        <canvas
          ref={carrierAnalyserCanvasRef}
          style={{ display: "block", width: 800, height: 400 }}
          width="600"
          height="300"
        />
        <canvas
          ref={freqResponseCanvasRef}
          className="vocoderNode_overlayCanvas"
          width="800"
          height="400"
        />
        <button className="vocoderNode_overlayPause" onClick={() => setPaused(!paused)}>
          {paused ? "Run" : "Pause"}
        </button>
      </div>
      <div className="customNode_editor nodrag">
        <div className="vocoderNode_bandStrips">
          {modConfig.map((filterDesc, i) => {
            const gainHandler = (gainDb: number) =>
              setModConfig(
                produce(modConfig, draft => {
                  draft[i].gainDb = gainDb;
                })
              );
            const qHandler = (q: number) =>
              setModConfig(
                produce(modConfig, draft => {
                  draft[i].q = q;
                })
              );
            return (
              <BandStrip
                key={filterDesc.hz}
                filterDesc={filterDesc}
                bandStyle={BAND_COLORS[i]}
                onGainChange={gainHandler}
                onQChange={qHandler}
              ></BandStrip>
            );
          })}
        </div>
      </div>
    </Node>
  );
}

function drawFrequencyResponse(
  context: CanvasRenderingContext2D,
  bandResponses: Map<number, BandResponse>,
  { min, max }: { min: number; max: number }
) {
  const height = context.canvas.height;
  const width = context.canvas.width;

  const toLog = (value: number) => (value === 0 ? 0 : Math.log10(value / 100));
  const minLog = toLog(min);
  const maxLog = toLog(max);
  const getX = (hz: number) => {
    const hzLog = toLog(hz);
    return width * ((hzLog - minLog) / (maxLog - minLog));
  };

  context.clearRect(0, 0, width, height);

  const responseUnitHeight = height / 3;

  // Then draw the response lines on top
  for (const [i, { hz: bandHz }] of FILTER_BANDS.entries()) {
    const { frequencies, magResponse } = bandResponses.get(bandHz)!;
    const { responseColor } = BAND_COLORS[i]!;

    context.strokeStyle = color(responseColor).alpha(0.26).rgb().string();
    context.lineWidth = 2;

    const gradient = context.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, color(responseColor).alpha(0.15).rgb().string());
    gradient.addColorStop(0.2, color(responseColor).alpha(0.1).rgb().string());
    gradient.addColorStop(1, color(responseColor).alpha(0.01).rgb().string());

    let lineStarted = false;
    let x: number = 0;
    let minY: number = height;

    const frequencyCount = magResponse.length;
    for (let i = 0; i < frequencyCount; i++) {
      const hz = frequencies[i];
      x = getX(hz);
      const y = height - responseUnitHeight * magResponse[i];
      minY = Math.min(y, minY);

      if (!lineStarted) {
        context.beginPath();
        context.moveTo(x, y);
        lineStarted = true;
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
    context.lineTo(x, height);
    context.lineTo(0, height);
    context.closePath();
    context.fillStyle = gradient;

    context.fill();
  }
}

function drawBins(
  context: CanvasRenderingContext2D,
  bandBins: { frequency: number; freqBins: Uint8Array }[],
  {
    min,
    max,
    sampleRate,
  }: {
    min: number;
    max: number;
    sampleRate: number;
  }
) {
  const height = context.canvas.height;
  const width = context.canvas.width;

  context.clearRect(0, 0, width, height);

  if (!bandBins.length) {
    return;
  } else if (bandBins.length > BAND_COLORS.length) {
    console.error("Not enough frequency colors");
    return;
  }

  const bandwidth = sampleRate / 2;
  const binRangeStart = Math.floor(BIN_COUNT * (min / bandwidth));
  const binRangeEnd = Math.ceil(BIN_COUNT * (max / bandwidth));
  const binRangeLength = binRangeEnd - binRangeStart;

  const binBarWidth = width / binRangeLength;
  const unclippedHeight = height - 60;
  const cumulativeHeightsPerBin = generateArray(binRangeLength, () => 0);

  // Draw the frequency bins for this passband
  for (const [i, { freqBins }] of bandBins.entries()) {
    const { freqColor } = BAND_COLORS[i]!;
    context.fillStyle = freqColor;

    let x = 0; // Reset x
    const freqRange = freqBins.subarray(binRangeStart, binRangeEnd);
    for (let i = 0; i < binRangeLength; i++) {
      const barHeight = unclippedHeight * (freqRange[i] / 255.0);
      const y = height - barHeight - cumulativeHeightsPerBin[i];
      context.fillRect(x, y, binBarWidth, barHeight);

      x += binBarWidth;
      cumulativeHeightsPerBin[i] += barHeight;
    }
  }
}

function drawBinsAsLine(
  context: CanvasRenderingContext2D,
  bandBins: { frequency: number; freqBins: Uint8Array }[],
  {
    min,
    max,
    sampleRate,
  }: {
    min: number;
    max: number;
    sampleRate: number;
  }
) {
  if (!bandBins.length) {
    return;
  } else if (bandBins.length > BAND_COLORS.length) {
    console.error("Not enough frequency colors");
    return;
  }

  const height = context.canvas.height;
  const width = context.canvas.width;

  const toLog = (value: number) => (value === 0 ? 0 : Math.log10(value / 100));
  const minLog = toLog(min);
  const maxLog = toLog(max);
  const getX = (hz: number) => {
    const hzLog = toLog(hz);
    return width * ((hzLog - minLog) / (maxLog - minLog));
  };

  context.clearRect(0, 0, width, height);

  const bandwidth = sampleRate / 2;

  const binRangeStart = Math.floor(BIN_COUNT * (min / bandwidth));
  const binRangeEnd = Math.ceil(BIN_COUNT * (max / bandwidth));
  const binRangeLength = binRangeEnd - binRangeStart;

  const hzStepPerBin = bandwidth / BIN_COUNT;
  const binHzStart = binRangeStart * hzStepPerBin;

  const unclippedHeight = height - 60;

  // Draw the frequency bins for this passband
  for (const [i, { freqBins }] of bandBins.entries()) {
    const { freqColor } = BAND_COLORS[i]!;
    context.strokeStyle = freqColor;
    context.lineWidth = 2;
    context.beginPath();

    let x = 0; // Reset x
    let lineStarted = false;
    const freqRange = freqBins.subarray(binRangeStart, binRangeEnd);
    for (let i = 0; i < binRangeLength; i++) {
      const hz = binHzStart + i * hzStepPerBin;
      x = getX(hz);
      const barHeight = unclippedHeight * (freqRange[i] / 255.0);
      const y = height - barHeight;

      if (!lineStarted) {
        context.moveTo(x, y);
        lineStarted = true;
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
  }
}

const FREQ_COLORS = [
  "#fff566",
  "#b37feb",
  "#5cdbd3",
  "#85a5ff",
  "#ff85c0",
  "#95de64",
  "#ffd666",
  "#ff7875",
  "#ff9c6e",
  "#ffc069",
  "#d3f261",
  "#69c0ff",
];

const FREQ_RESPONSE_COLORS = [
  "#ffec3d",
  "#9254de",
  "#36cfc9",
  "#597ef7",
  "#f759ab",
  "#73d13d",
  "#ffc53d",
  "#ff4d4f",
  "#ff7a45",
  "#ffa940",
  "#bae637",
  "#40a9ff",
];

const BAND_COLORS: BandStyle[] = zip(FREQ_COLORS, FREQ_RESPONSE_COLORS).map(
  ([freqColor, responseColor]) => ({
    freqColor,
    responseColor,
  })
);

export default React.memo(Vocoder);
