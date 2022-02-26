import StoppableAudioWorkletProcessor from "./StoppableAudioWorkletProcessor";
import { Mode } from "./aubio-processor.types";
import aubio from "aubiojs";

class AubioProcessor extends StoppableAudioWorkletProcessor {
  mode: Mode;
  tempo: any;
  tempoInstance: any;

  constructor(options?: AudioWorkletNodeOptions) {
    super(options);
    // console.log("options", options);
    this.init();
    this.mode = options?.processorOptions.mode ?? Mode.Bpm;
  }

  async init() {
    // console.log("init");
    const { Tempo } = await aubio();
    this.tempo = Tempo;
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ) {
    const input = inputs?.[0]?.[0];
    // console.log(inputs, outputs, parameters);
    if (input == null) {
      return this.running;
    }

    if (!this.tempo) {
      return false;
    }

    if (!this.tempoInstance) {
      console.log("create tempo instance", inputs?.[0]?.[0]?.length);
      const bufferSize = inputs?.[0]?.[0]?.length;

      if (bufferSize) {
        this.tempoInstance = new this.tempo(bufferSize * 4, bufferSize, sampleRate);
      }
    }

    if (this.tempoInstance) {
      this.tempoInstance.do(inputs?.[0]?.[0]);
      console.log(
        `bpm: ${this.tempoInstance.getBpm()} withConfidence: ${this.tempoInstance.getConfidence()}`
      );
    }

    return this.running;
  }
}

registerProcessor("aubio-processor", AubioProcessor);

// Fixes TypeScript error TS1208:
// File cannot be compiled under '--isolatedModules' because it is considered a global script file.
export {};
