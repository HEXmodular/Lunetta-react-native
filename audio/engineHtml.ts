import { createOscillatorControlsScript } from "@/audio/oscillatorControlsHtml";
import { createOscillatorScript } from "@/audio/oscillatorHtml";
import { createReverbControlsScript } from "@/audio/reverbControlsHtml";

function createReverbScript(defaultFreq: number) {
  return `
      const MAX_DELAY = 10;

      function dbToGain(db) {
        return Math.pow(10, db / 20);
      }

      function resonanceToQ(percent) {
        return 0.707 + (Math.max(0, Math.min(100, percent)) / 100) * 29.293;
      }

      function createHardClipper() {
        var clipper = audioCtx.createWaveShaper();
        clipper.curve = new Float32Array([-1, 1]);
        clipper.channelCount = 1;
        clipper.channelCountMode = "explicit";
        return clipper;
      }

      function createReverbChain() {
        var gain = audioCtx.createGain();
        var filter = audioCtx.createBiquadFilter();
        var clipper = createHardClipper();
        var delayGain = audioCtx.createGain();
        var delay = audioCtx.createDelay(MAX_DELAY);
        var delayFilter = audioCtx.createBiquadFilter();
        var delayClipper = createHardClipper();
        gain.channelCount = 1;
        gain.channelCountMode = "explicit";
        filter.channelCount = 1;
        filter.channelCountMode = "explicit";
        delayGain.channelCount = 1;
        delayGain.channelCountMode = "explicit";
        delay.channelCount = 1;
        delay.channelCountMode = "explicit";
        delayFilter.channelCount = 1;
        delayFilter.channelCountMode = "explicit";
        filter.type = "lowpass";
        filter.frequency.value = ${defaultFreq};
        filter.Q.value = 0.707;
        delayFilter.type = "lowpass";
        delayFilter.frequency.value = ${defaultFreq};
        delayFilter.Q.value = 0.707;
        gain.gain.value = 1;
        delayGain.gain.value = 1;
        delay.delayTime.value = 0;
        gain.connect(filter);
        filter.connect(clipper);
        clipper.connect(gain);
        clipper.connect(delayGain);
        delayGain.connect(delay);
        delay.connect(delayFilter);
        delayFilter.connect(delayClipper);
        delayClipper.connect(delayGain);
        return {
          gain: gain,
          filter: filter,
          clipper: clipper,
          delayGain: delayGain,
          delay: delay,
          delayFilter: delayFilter,
          delayClipper: delayClipper,
        };
      }

      const chains = [createReverbChain(), createReverbChain()];
      const chainGainDb = [0, 0];
      const chainInverted = [false, false];
      const dryGain = audioCtx.createGain();
      const wetGain = audioCtx.createGain();
      const masterGain = audioCtx.createGain();
      const leftKeep = audioCtx.createGain();
      const leftCross = audioCtx.createGain();
      const rightKeep = audioCtx.createGain();
      const rightCross = audioCtx.createGain();
      const stereoMerger = audioCtx.createChannelMerger(2);

      dryGain.gain.value = 0.5;
      wetGain.gain.value = 0.5;
      masterGain.gain.value = 1;
      leftKeep.gain.value = 0.75;
      leftCross.gain.value = 0.25;
      rightKeep.gain.value = 0.75;
      rightCross.gain.value = 0.25;

      outputGain.connect(dryGain);
      dryGain.connect(masterGain);
      outputGain.connect(chains[0].gain);
      outputGain.connect(chains[1].gain);

      chains[0].delayClipper.connect(leftKeep);
      chains[0].delayClipper.connect(leftCross);
      chains[1].delayClipper.connect(rightKeep);
      chains[1].delayClipper.connect(rightCross);
      leftKeep.connect(stereoMerger, 0, 0);
      rightCross.connect(stereoMerger, 0, 0);
      rightKeep.connect(stereoMerger, 0, 1);
      leftCross.connect(stereoMerger, 0, 1);
      stereoMerger.connect(wetGain);
      wetGain.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      function applyChainGain(index) {
        var linear = dbToGain(chainGainDb[index]);
        if (chainInverted[index]) linear = -linear;
        chains[index].gain.gain.setValueAtTime(linear, audioCtx.currentTime);
        chains[index].delayGain.gain.setValueAtTime(linear, audioCtx.currentTime);
      }
`;
}

export function createEngineHtml(defaultFreq: number, defaultLfoRate = 1) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <script>
      ${createOscillatorScript(defaultFreq, defaultLfoRate)}
      ${createOscillatorControlsScript()}
      ${createReverbScript(defaultFreq)}
      ${createReverbControlsScript()}
    </script>
  </body>
</html>`;
}
