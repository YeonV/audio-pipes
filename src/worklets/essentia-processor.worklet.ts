import StoppableAudioWorkletProcessor from "./StoppableAudioWorkletProcessor";
import type EssentiaType from 'essentia.js/dist/core_api'
const WasmRingBuffer = require('wasm-ring-buffer');

const Essentia = require('essentia.js/dist/essentia.js-core.es');
// import essentia-wasm-module
const { EssentiaWASM } = require('essentia.js/dist/essentia-wasm.es.js');

class EssentiaProcessor extends StoppableAudioWorkletProcessor {
  essentia: EssentiaType = new Essentia.default(EssentiaWASM);
//   collectedBuffer = new Float32Array(4096);
//   bufferCollect = 1;
  _ringBuffer = new WasmRingBuffer.default(2048, 128);

  process(inputs: Float32Array[][], outputs: Float32Array[][], ) {
    const input = inputs[0];

    if (input.length === 0) {
    //   this.port.postMessage({ payload: { channel: 0, level: 0 }, type: MESSAGE_LEVEL });
    //   this.port.postMessage({ payload: { channels: input.length }, type: MESSAGE_CHANNELS });
      return this.running;
    }

    // for (let channel = 0; channel < input.length; ++channel) {
    // //   const level = getMaxAmplitude(input[channel]);
    // //   this.port.postMessage({ payload: { channel, level }, type: MESSAGE_LEVEL });
    // }
    const output = new Float32Array(2048);

    this._ringBuffer.enqueue(input[0]); //storing

    while (this._ringBuffer.size() >= 2048) {
        this._ringBuffer.dequeue(output); //retrieving
        const vectorInput = this.essentia.arrayToVector(output);
        let onset = this.essentia.OnsetDetectionGlobal(vectorInput, 2048, 512, 'beat_emphasis', sampleRate) // input audio frame
        const result = onset.onsetDetections.get(0);
        console.log(output, result)

    }


    // this.port.postMessage({ payload: { channels: input.length }, type: MESSAGE_CHANNELS });

    return this.running;
  }
}

registerProcessor("essentia-processor", EssentiaProcessor);

// Fixes TypeScript error TS1208:
// File cannot be compiled under '--isolatedModules' because it is considered a global script file.
export {};
