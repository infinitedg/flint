var midiTransform = {
  scaleTo255: function(x) {
    // Use 0-127 as initial scale
    return x * 255 / 127;
  },
  scaleTo100: function(x) {
    return x * 100 / 127;
  }
};

Template.comp_flint_midi.onCreated(function() {
  console.log('comp_flint_midi created');
  // request MIDI access
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
      sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
  } else {
    Flint.Log.error('No support for MIDI devices found');
  }

  // midi functions
  function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    this.midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

    var inputs = this.midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      // each time there is a midi message call the onMIDIMessage function
      input.value.onmidimessage = onMIDIMessage;
    }
  }

  function onMIDIFailure(error) {
    // when we get a failed response, run this code
    Flint.Log.error('No support for MIDI devices found: ' + error);
  }

  function onMIDIMessage(message) {
    var data = message.data; // this gives us our [command/channel, note, velocity] data.

    var channel = data[0];
    var note = data[1];
    var velocity = data[2];

    var doc = Flint.collection('flintMidiMappings')
      .findOne({channel: channel, note: note});

    if (doc.transform && midiTransform[doc.transform]) {
      velocity = midiTransform[doc.transform](velocity);
    }

    var updateObj = {};
    updateObj[doc.targetKey] = velocity;
    Flint.collection(doc.collection).update(doc.selector, {$set: updateObj});
  }

  // Setup observers for all MIDI collection values
  this.observers = {};
  Flint.collection('flintMidiMappings').find({}).observe({
    added: function(doc) {
      console.log(this);
    },
    changed: function(doc) {

    },
    removed: function(doc) {

    }
  });
});
