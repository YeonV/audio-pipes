class StoppableAudioWorkletProcessor extends AudioWorkletProcessor {
  running = true;
  readonly id: String;

  constructor(options?: AudioWorkletNodeOptions) {
    super(options);
    this.id = options?.processorOptions?.id;
    console.log(this.id, "worklet created");

    this.port.onmessage = event => {
      if (event.data === "stop") {
        console.log("stopping worklet", this.id);
        this.stop();
      }
    };
  }

  stop() {
    this.running = false;
  }
}

export default StoppableAudioWorkletProcessor;
