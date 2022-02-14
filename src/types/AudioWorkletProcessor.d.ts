// See: https://github.com/microsoft/TypeScript/issues/28308#issuecomment-650802278
interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
  parameterDescriptors?: AudioParamDescriptor[];
};

interface AudioParamDescriptor {
  /**
   * The DOMString which represents the name of the AudioParam. Under this name
   * the AudioParam will be available in the parameters property of the node,
   * and under this name the AudioWorkletProcessor.process method will acquire
   * the calculated values of this AudioParam.
   * */
  name: string;

  /**
   * Either "a-rate", or "k-rate" string which represents an automation rate of
   * this AudioParam. Defaults to "a-rate".
   */
  automationRate?: "a-rate" | "k-rate";

  /**
   * A float which represents minimum value of the AudioParam. Defaults to
   * -3.4028235e38.
   */
  minValue?: number;

  /**
   * A float which represents maximum value of the AudioParam. Defaults to
   * 3.4028235e38.
   */
  maxValue?: number;

  /**
   * A float which represents initial value of the AudioParam. Defaults to 0.
   */
  defaultValue?: number;
}
