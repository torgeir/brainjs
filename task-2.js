console.log("task-2.js");

(async () => {
  const midi = await Midi.fromUrl("til-elise.mid");

  const name = midi.name;

  /*
    Example midi use

    //get the tracks
    midi.tracks.forEach((track) => {
      //tracks have notes and controlChanges

      //notes are an array
      const notes = track.notes;
      notes.forEach((note) => {
        //note.midi, note.time, note.duration, note.name
        console.log(note);
      });

      //the track also has a channel and instrument
      //track.instrument.name
    });
  */

  const tilEliseNotes = midi.tracks
    .map((track) => track.notes.map((note) => note.midi))
    .flat();
  console.log(tilEliseNotes);

  // Task:
  // Use an LSTM Time Step network
  // Feed it with sequences of notes from the midi above
  // Make it forcast the next notes given a set of input notes
  // Play the sequence of notes using Tone.js, see readme.md
})();
