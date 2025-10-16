class VolumeProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0][0];
    if (!input) return true;

    let sum = 0;
    for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
    const rms = Math.sqrt(sum / input.length);
    this.port.postMessage({ volume: rms });
    return true;
  }
}
registerProcessor("volume-processor", VolumeProcessor);
