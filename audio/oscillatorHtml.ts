export function createOscillatorHtml(defaultFreq: number, defaultLfoRate = 1) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <script>
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const OSC_COUNT = 4;
      const INPUT_COUNT = 5;
      const oscillators = [];
      const outputGain = audioCtx.createGain();
      const lfo = audioCtx.createOscillator();

      function xorBits(bits) {
        var bit = 0;
        for (var n = 0; n < bits.length; n++) {
          bit ^= bits[n] >= 0 ? 1 : 0;
        }
        return bit ? 1 : -1;
      }

      function mixSample(osc1, osc2, osc3, osc4, lfoSample) {
        var selected = lfoSample < 0 ? osc3 : osc4;
        return xorBits([osc1, osc2, selected]);
      }

      for (var i = 0; i < OSC_COUNT; i++) {
        var osc = audioCtx.createOscillator();
        osc.type = "square";
        osc.frequency.value = ${defaultFreq};
        oscillators.push(osc);
      }

      lfo.type = "square";
      lfo.frequency.value = ${defaultLfoRate};

      outputGain.gain.value = 0.2;
      outputGain.connect(audioCtx.destination);

      window.setFrequency = function (index, hz) {
        oscillators[index].frequency.setValueAtTime(hz, audioCtx.currentTime);
        audioCtx.resume();
      };

      window.setLfoRate = function (hz) {
        lfo.frequency.setValueAtTime(hz, audioCtx.currentTime);
        audioCtx.resume();
      };

      function startOscillators() {
        for (var i = 0; i < OSC_COUNT; i++) {
          oscillators[i].start();
        }
        lfo.start();
        audioCtx.resume();
      }

      function connectSources(node) {
        for (var i = 0; i < OSC_COUNT; i++) {
          oscillators[i].connect(node, 0, i);
        }
        lfo.connect(node, 0, OSC_COUNT);
      }

      function connectScriptProcessorXor() {
        const merger = audioCtx.createChannelMerger(INPUT_COUNT);
        const xorNode = audioCtx.createScriptProcessor(1024, INPUT_COUNT, 1);
        xorNode.channelCount = INPUT_COUNT;
        xorNode.channelCountMode = "explicit";
        xorNode.channelInterpretation = "discrete";
        connectSources(merger);
        merger.connect(xorNode);
        xorNode.connect(outputGain);
        xorNode.onaudioprocess = function (event) {
          const input = event.inputBuffer;
          const out = event.outputBuffer.getChannelData(0);
          const channels = [];
          for (var n = 0; n < INPUT_COUNT; n++) {
            channels.push(
              input.numberOfChannels > n ? input.getChannelData(n) : channels[0],
            );
          }
          for (var i = 0; i < out.length; i++) {
            out[i] = mixSample(
              channels[0][i],
              channels[1][i],
              channels[2][i],
              channels[3][i],
              channels[4][i],
            );
          }
        };
        startOscillators();
      }

      const workletCode =
        "function xorBits(bits) {" +
        "  var bit = 0;" +
        "  for (var n = 0; n < bits.length; n++) {" +
        "    bit ^= bits[n] >= 0 ? 1 : 0;" +
        "  }" +
        "  return bit ? 1 : -1;" +
        "}" +
        "function mixSample(osc1, osc2, osc3, osc4, lfoSample) {" +
        "  var selected = lfoSample < 0 ? osc3 : osc4;" +
        "  return xorBits([osc1, osc2, selected]);" +
        "}" +
        "class XorProcessor extends AudioWorkletProcessor {" +
        "  process(inputs, outputs) {" +
        "    var osc1 = inputs[0] && inputs[0][0];" +
        "    var osc2 = inputs[1] && inputs[1][0];" +
        "    var osc3 = inputs[2] && inputs[2][0];" +
        "    var osc4 = inputs[3] && inputs[3][0];" +
        "    var lfoIn = inputs[4] && inputs[4][0];" +
        "    var out = outputs[0] && outputs[0][0];" +
        "    if (!osc1 || !osc2 || !osc3 || !osc4 || !lfoIn || !out) return true;" +
        "    for (var i = 0; i < out.length; i++) {" +
        "      out[i] = mixSample(osc1[i], osc2[i], osc3[i], osc4[i], lfoIn[i]);" +
        "    }" +
        "    return true;" +
        "  }" +
        "}" +
        "registerProcessor('xor-processor', XorProcessor);";

      if (audioCtx.audioWorklet) {
        const url =
          "data:application/javascript;charset=utf-8," +
          encodeURIComponent(workletCode);
        audioCtx.audioWorklet
          .addModule(url)
          .then(function () {
            const xorNode = new AudioWorkletNode(audioCtx, "xor-processor", {
              numberOfInputs: INPUT_COUNT,
              numberOfOutputs: 1,
              outputChannelCount: [1],
            });
            connectSources(xorNode);
            xorNode.connect(outputGain);
            startOscillators();
          })
          .catch(function () {
            connectScriptProcessorXor();
          });
      } else {
        connectScriptProcessorXor();
      }
    </script>
  </body>
</html>`;
}
