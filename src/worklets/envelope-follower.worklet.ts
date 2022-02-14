import { ParameterDefaults, Parameters } from "./envelope-follower.types";
import StoppableAudioWorkletProcessor from "./StoppableAudioWorkletProcessor";

/**
 * The envelope follower is used to detect the amplitude variations of an
 * incoming signal to produce a control signal that resembles those variations.
 *
 * Attack and release parameters can be provided in order to control the rate of
 * the signal's rise and fall.
 */
class EnvelopeFollowerProcessor extends StoppableAudioWorkletProcessor {
  private envelopeOut: number = 0;

  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: Parameters.AttackTime,
        defaultValue: ParameterDefaults.attack,
        minValue: 0,
        automationRate: "k-rate",
      },
      {
        name: Parameters.ReleaseTime,
        defaultValue: ParameterDefaults.release,
        minValue: 0,
        automationRate: "k-rate",
      },
    ];
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<Parameters, Float32Array>
  ) {
    const input = inputs[0];
    const output = outputs[0];
    const attack = Math.exp(-1 / (sampleRate * parameters.attack[0]));
    const release = Math.exp(-1 / (sampleRate * parameters.release[0]));

    for (let channel = 0; channel < input.length; ++channel) {
      const sampleFrames = input[channel].length;

      for (let i = 0; i < sampleFrames; i++) {
        const envelopeIn = Math.abs(input[channel][i]);
        if (this.envelopeOut < envelopeIn) {
          this.envelopeOut = envelopeIn + attack * (this.envelopeOut - envelopeIn);
        } else {
          this.envelopeOut = envelopeIn + release * (this.envelopeOut - envelopeIn);
        }
        this.envelopeOut = Math.max(this.envelopeOut, 0);
        output[channel][i] = this.envelopeOut;
      }
    }

    return this.running;
  }
}

registerProcessor("envelope-follower", EnvelopeFollowerProcessor);

// Fixes TypeScript error TS1208:
// File cannot be compiled under '--isolatedModules' because it is considered a global script file.
export {};
