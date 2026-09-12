export function createReverbControlsScript() {
  return `
      window.setReverbGain = function (index, db) {
        chainGainDb[index] = db;
        applyChainGain(index);
        audioCtx.resume();
      };

      window.setReverbPhase = function (index, inverted) {
        chainInverted[index] = !!inverted;
        applyChainGain(index);
        audioCtx.resume();
      };

      window.setReverbFrequency = function (index, hz) {
        chains[index].filter.frequency.setValueAtTime(
          hz,
          audioCtx.currentTime,
        );
        chains[index].delayFilter.frequency.setValueAtTime(
          hz,
          audioCtx.currentTime,
        );
        audioCtx.resume();
      };

      window.setReverbResonance = function (index, percent) {
        chains[index].filter.Q.setValueAtTime(
          resonanceToQ(percent),
          audioCtx.currentTime,
        );
        audioCtx.resume();
      };

      window.setReverbDelay = function (index, ms) {
        var seconds = Math.max(0, Math.min(MAX_DELAY, ms / 1000));
        chains[index].delay.delayTime.linearRampToValueAtTime(
          seconds,
          audioCtx.currentTime+0.5,
        );
        audioCtx.resume();
      };

      window.setDryWet = function (percent) {
        var wet = Math.max(0, Math.min(100, percent)) / 100;
        dryGain.gain.setValueAtTime(1 - wet, audioCtx.currentTime);
        wetGain.gain.setValueAtTime(wet, audioCtx.currentTime);
        audioCtx.resume();
      };

      window.setMasterVolume = function (percent) {
        var linear = Math.max(0, Math.min(100, percent)) / 100;
        masterGain.gain.setValueAtTime(linear, audioCtx.currentTime);
        audioCtx.resume();
      };
`;
}
