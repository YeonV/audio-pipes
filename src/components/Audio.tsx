/* eslint-disable import/no-webpack-loader-syntax */
import React, { useCallback, useEffect, useState } from "react";
import { useAudioContext } from "../hooks/state/useAudioContext";
import { AudioContext } from "../utils/audioContext";

import ADSRWorkletProcessor from "worklet-loader!../worklets/adsr-processor.worklet.ts";
import AndGateWorkletProcessor from "worklet-loader!../worklets/and-gate-processor.worklet.ts";
import ComparatorWorkletProcessor from "worklet-loader!../worklets/comparator-processor.worklet.ts";
import EnvelopeFollowerWorkletProcessor from "worklet-loader!../worklets/envelope-follower.worklet.ts";
import GateWorkletProcessor from "worklet-loader!../worklets/gate-processor.worklet.ts";
import MeterWorkletProcessor from "worklet-loader!../worklets/meter-processor.worklet.ts";
import NoiseWorkletProcessor from "worklet-loader!../worklets/noise-processor.worklet.ts";
import NotGateWorkletProcessor from "worklet-loader!../worklets/not-gate-processor.worklet.ts";
import OrGateWorkletProcessor from "worklet-loader!../worklets/or-gate-processor.worklet.ts";
import QuantizerWorkletProcessor from "worklet-loader!../worklets/quantizer-processor.worklet.ts";
import RectifierWorkletProcessor from "worklet-loader!../worklets/rectifier-processor.worklet.ts";
import SampleAndHoldWorkletProcessor from "worklet-loader!../worklets/sample-and-hold-processor.worklet.ts";
import SignWorkletProcessor from "worklet-loader!../worklets/sign-processor.worklet.ts";
import TransformerWorkletProcessor from "worklet-loader!../worklets/transformer-processor.worklet.ts";
import XorGateWorkletProcessor from "worklet-loader!../worklets/xor-gate-processor.worklet.ts";
import AubioWorkletProcessor from "worklet-loader!../worklets/aubio-processor.worklet.ts";
import EssentiaWorkletProcessor from "worklet-loader!../worklets/essentia-processor.worklet.ts";

interface Props {
  children: React.ReactNode;
}

function Audio({ children }: Props) {
  const [ready, setReady] = useState(false);
  const { audioContext } = useAudioContext();

  useEffect(() => {
    const awaitAudioWorkletProcessors = async (context: AudioContext) => {
      if (!context.audioWorklet) {
        return;
      }

      await Promise.all([
        context.audioWorklet.addModule(ADSRWorkletProcessor),
        context.audioWorklet.addModule(AndGateWorkletProcessor),
        context.audioWorklet.addModule(ComparatorWorkletProcessor),
        context.audioWorklet.addModule(EnvelopeFollowerWorkletProcessor),
        context.audioWorklet.addModule(GateWorkletProcessor),
        context.audioWorklet.addModule(MeterWorkletProcessor),
        context.audioWorklet.addModule(NoiseWorkletProcessor),
        context.audioWorklet.addModule(NotGateWorkletProcessor),
        context.audioWorklet.addModule(OrGateWorkletProcessor),
        context.audioWorklet.addModule(QuantizerWorkletProcessor),
        context.audioWorklet.addModule(RectifierWorkletProcessor),
        context.audioWorklet.addModule(SampleAndHoldWorkletProcessor),
        context.audioWorklet.addModule(SignWorkletProcessor),
        context.audioWorklet.addModule(TransformerWorkletProcessor),
        context.audioWorklet.addModule(XorGateWorkletProcessor),
        context.audioWorklet.addModule(AubioWorkletProcessor),
        context.audioWorklet.addModule(EssentiaWorkletProcessor)
    ]);
      setReady(true);
    };

    if (audioContext) {
      awaitAudioWorkletProcessors(audioContext);
    }
  }, [audioContext]);

  const resume = useCallback(() => {
    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }
  }, [audioContext]);

  if (!audioContext) {
    return <div>Sorry, but the Web Audio API is not supported by your browser.</div>;
  }

  if (!ready) {
    // TODO add loader
    return null;
  }

  return <div onClick={resume}>{children}</div>;
}

export default Audio;
