console.log("task-2.js");
const rand = (n) => n * Math.random();
const round = (n) => parseInt(Math.round(n));
const chunk = (arr, size) =>
  arr.length ? [arr.slice(0, size)].concat(chunk(arr.slice(size), size)) : [];

(async () => {
  const synth = new Tone.Synth().toMaster();
  const midi = await Midi.fromUrl("til-elise.mid");
  const tilEliseNotes = midi.tracks.flatMap((track) =>
    track.notes.map((note) => note.midi)
  );

  const net = new brain.recurrent.LSTMTimeStep({ hiddenLayers: [10, 10] });
  window.net = net;

  // remove the last chunk, it possibly has less notes
  // and all arrays to .train need to be of equal length
  const trainingData = chunk(tilEliseNotes, 10).reverse().slice(1).reverse();

  net.train(trainingData, {
    log: true,
    logPeriod: 250,
    iterations: 5000,
  });

  console.log("Training complete, click the document.body to hear music.");

  const toMidiNote = (midiValue) => Tone.Frequency(midiValue, "midi").toNote();
  const atTime = (i) => Tone.context.currentTime + 1 + i * 0.5;

  function play() {
    const startNote = round(rand(tilEliseNotes.length - 5));
    const firstNotes = tilEliseNotes.slice(startNote, startNote + 5);
    const nextNotes = net.forecast(firstNotes, 5).map(round);
    const notes = firstNotes.concat(nextNotes).map(round);
    console.log(
      `Predicted sequence of tones ${nextNotes} based on the previous ${firstNotes}, from the note starting at ${startNote} in the song`
    );
    notes
      .map(toMidiNote)
      .forEach((note, i) =>
        setTimeout(() => synth.triggerAttackRelease(note, "8n", atTime(i)))
      );
  }

  document.addEventListener("click", play);
})();
