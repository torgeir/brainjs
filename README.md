# brainjs

## Intro

- neural networks in the browser [brain.js](https://github.com/BrainJS/brain.js)
- on the gpu [gpu.rocks](https://gpu.rocks/#/) and [gpu.js](https://github.com/gpujs/gpu.js)
- high level (no really! high level)
- neural network (backpropagation) [Example: Recommend text color based on background](https://github.com/BrainJS/brain.js#for-training-with-neuralnetwork)
- rnntimestep, lstmtimestep, gruptimestep [Example: XOR approximated](https://github.com/BrainJS/brain.js#for-training-with-rnntimestep-lstmtimestep-and-grutimestep)
- rnn [Exampe: XOR with discrete values](https://github.com/BrainJS/brain.js#examples)

## Task suggestions

- **Task-1.js**: Change the neural net to prefer red and green colors
- **Task-1.js**: Extend the network to handle 3 colors, remember to add the third preferred color to score()
- **Task-2.js**: Write a lstm neural network to forecast sequences of notes, based on midi input
- **Task-3.js**: Given the set of palettes in colors.js, use brain.js to generate new, pretty palettes

## Tips

### Pretty color palettes available

```js
palettes.slice(0, 2)
[[
  [249,193,206],
  [253,212,189],
  [120,205,208]],
 [
  [249,193,206],
  [165,200,209],
  [0,147,165]]]
```

### Play midi in the browser

You can play notes using [Tone.js](https://tonejs.github.io/), e.g. like

```js
let synth = new Tone.Synth().toMaster();

let toNote = midiValue => Tone.Frequency(midiValue, "midi").toNote()

function play () {
  const startOfFurElise = [76, 75, 76, 75, 76]; // next is 71
  startOfFurElise
    .map(toNote)
    .forEach((note, i) => {
      console.log(note);
      synth.triggerAttackRelease(note, "8n", Tone.context.currentTime + i * 0.5);
    });
}

document.addEventListener('click', play);
```

## Resources

- [Play music in the browser](https://tonejs.github.io/)
- [Convert midi to json](https://tonejs.github.io/Midi/)
- [Cracking captchas with neural networks](https://codepen.io/birjolaxew/post/cracking-captchas-with-neural-networks)
