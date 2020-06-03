# brainjs-colors

## Intro

- neural networks in the browser [brain.js](https://github.com/BrainJS/brain.js)
- on the gpu [gpu.js](https://github.com/gpujs/gpu.js)
- high level (no really! high level)
- neural network (backpropagation) [Example: Recommend text color based on background](https://github.com/BrainJS/brain.js#for-training-with-neuralnetwork)
- rnntimestep, lstmtimestep, gruptimestep [Example: XOR approximated](https://github.com/BrainJS/brain.js#for-training-with-rnntimestep-lstmtimestep-and-grutimestep)
- rnn [Exampe: XOR with discrete values](https://github.com/BrainJS/brain.js#examples)

## Task suggestions

- Change task-1.js so that you train the neural net to prefer red and green colors
- Extend the network in task-1.js to handle 3 colors, and prefer the last one to be blue 
- 
- Given the set of palettes in colors.js, use brain.js to generate new, pretty palettes

## Play music

You can play notes using [Tone.js](https://tonejs.github.io/), e.g. like

```js
document.addEventListener("click", () => {
  var synth = new Tone.FMSynth().toMaster()
  synth.triggerAttackRelease('C1', 0.5, 0)
})
```
