import StoppableAudioWorkletProcessor from "./StoppableAudioWorkletProcessor";
import { Mode } from "./aubio-processor.types";
import aubio from "aubiojs";
// import { exponential, linear, logarithmic } from "utils/scale";

// const GATE_OFF = 0;
// const GATE_ON = 1;
// const EPSILON = 0.01;

class AubioProcessor extends StoppableAudioWorkletProcessor {
  //   lastGainGetter: (time: number) => number;
  //   lastGainGetterAtStageChange: (time: number) => number;
  //   lastStage: Stage;
  //   lastTriggerType: number;
  //   lastTriggerTime: number[];
  //   sustainOn: boolean;
  mode: Mode;
  tempo: any;
  tempoInstance: any;

  constructor(options?: AudioWorkletNodeOptions) {
    super(options);

    console.log(this, options);
    // console.log('options', options);
    // this.lastGainGetter = () => 0;
    // this.lastGainGetterAtStageChange = () => 0;
    // this.lastStage = Stage.Attack;
    // this.lastTriggerTime = [-Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER];
    // this.lastTriggerType = GATE_OFF;
    // this.sustainOn = options?.processorOptions.sustainOn ?? true;
    console.log("options", options);
    this.init();
    this.mode = options?.processorOptions.mode ?? Mode.Bpm;
  }

  async init() {
    console.log("init");
    const { Tempo } = await aubio();
    this.tempo = Tempo;
  }

  //   static get parameterDescriptors() {
  //     return [
  //       {
  //         name: Parameters.AttackTime,
  //         defaultValue: 0,
  //         minValue: 0,
  //         maxValue: Number.MAX_SAFE_INTEGER,
  //         automationRate: "k-rate" as AutomationRate,
  //       },
  //       {
  //         name: Parameters.DecayTime,
  //         defaultValue: 0,
  //         minValue: 0,
  //         maxValue: Number.MAX_SAFE_INTEGER,
  //         automationRate: "k-rate" as AutomationRate,
  //       },
  //       {
  //         name: Parameters.ReleaseTime,
  //         defaultValue: 0,
  //         minValue: 0,
  //         maxValue: Number.MAX_SAFE_INTEGER,
  //         automationRate: "k-rate" as AutomationRate,
  //       },
  //       {
  //         name: Parameters.SustainLevel,
  //         defaultValue: 0,
  //         minValue: 0,
  //         maxValue: 1,
  //         automationRate: "k-rate" as AutomationRate,
  //       },
  //     ];
  //   }

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

    // const isGateOn = this.isGateOn(input);

    // if (this.lastTriggerType === GATE_OFF && isGateOn) {
    //   this.lastTriggerType = GATE_ON;
    //   this.lastTriggerTime[GATE_ON] = currentTime;
    // } else if (this.lastTriggerType === GATE_ON && !isGateOn) {
    //   this.lastTriggerType = GATE_OFF;
    //   // Do not re-trigger release stage
    //   if (this.lastStage !== Stage.Release) {
    //     this.lastTriggerTime[GATE_OFF] = currentTime;
    //   }
    // }

    // const stage = this.getStage(input, parameters);
    // if (stage !== this.lastStage) {
    //   this.lastGainGetterAtStageChange = this.lastGainGetter;
    //   this.lastStage = stage;
    // }

    // this.lastGainGetter = this.getGainGetter(stage, parameters);

    // const output = outputs[0][0];
    // const sampleFrames = output.length;
    // for (let i = 0; i < sampleFrames; i++) {
    //   output[i] = this.lastGainGetter(currentTime + i / sampleRate);
    // }

    return this.running;
  }
}

registerProcessor("aubio-processor", AubioProcessor);

// Fixes TypeScript error TS1208:
// File cannot be compiled under '--isolatedModules' because it is considered a global script file.
export {};
