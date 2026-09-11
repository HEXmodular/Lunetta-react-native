export function createOscillatorControlsScript() {
  return `
      window.setFrequency = function (index, hz) {
        oscillators[index].frequency.setValueAtTime(hz, audioCtx.currentTime);
        audioCtx.resume();
      };

      window.setLfoRate = function (hz) {
        lfo.frequency.setValueAtTime(hz, audioCtx.currentTime);
        audioCtx.resume();
      };

      window.setOscVolume = function (percent) {
        var linear = Math.max(0, Math.min(100, percent)) / 100;
        outputGain.gain.setValueAtTime(linear, audioCtx.currentTime);
        audioCtx.resume();
      };
`;
}
