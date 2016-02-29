// Used to take midi messages and map them to database values
var midiTransform = Template.comp_flint_midi.midiTransform = {
  scaleTo255: function(x) {
    // Use 0-127 as initial scale
    return x * 255 / 127;
  },
  scaleTo100: function(x) {
    return x * 100 / 127;
  },
  scaleTo4:function(x){
    return x * 4 / 127;
  },
  scaleTo4Inverse:function(x){
    return abs(x - 127) * 4 / 127;
  },
  bool:function(value){
    if (value > 0){
      return true;
    }
    return false;
  },
  boolNum:function(value){
    if (value > 63){
      return 1;
    }
    return 0;
  },
  neg1:function(value){
    return (value / 63.5) - 1;
  },
  mod4:function(value){
    return Math.ceil(((value + 1) / 128) * 4);
  }
};

// Used to take database values and convert them to MIDI messages
var midiTransformInverse = Template.comp_flint_midi.midiTransformInverse = {
  scaleTo255: function(x) {
    return Math.round(x * 127 / 255);
  },
  scaleTo100: function(x) {
    return Math.round(x * 127 / 100);
  },
  scaleTo4:function(x) {
    return Math.round(x * 127 / 4);
  },
  bool:function(value) {
    if (value){
      return 127;
    }
    return 0;
  },
  boolNum:function(value){
    if (value === 1){
      return 127;
    }
    return 0;
  },
  neg1:function(value){
    return (value + 1) * 63.5;
  },
  mod4:function(value){
    return value * (127 / 4);
  }
};

Template.comp_flint_midi.onCreated(function() {
  Meteor.subscribe("flint-midi.flintMidiMappings");
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
    this.midiOutput = this.midi.outputs.values().next().value;

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

    var midiCommand = data[0];
    var midiNote = data[1];
    var midiVelocity = data[2];
    var _id;
    var macros;
    var doc = Flint.collection('flintMidiMappings')
    .findOne({midiCommand: midiCommand, midiNote: midiNote});
    Session.set('flint_midi_currentCommand',{command:data[0],note:data[1],velocity:data[2]});
    if (doc) {
      _id = doc._id;
      if (doc.transform && midiTransform[doc.transform]) {
        midiVelocity = midiTransform[doc.transform](midiVelocity);
      }
      if (doc.type === 'collection'){
        var updateObj = Flint.collection(doc.collection).findOne(doc.selector);
        delete updateObj._id;
        //construct the property path properly.
        var propPath = doc.propertyPath.split('.');
        if (propPath.length === 1)  {
          updateObj[propPath[0]] = midiVelocity;
        }
        if (propPath.length === 2) {
          if (!updateObj[propPath[0]]){
            updateObj[propPath[0]] = {};
          }
          updateObj[propPath[0]][propPath[1]] = midiVelocity;
        }
        if (propPath.length === 3) {
          if (!updateObj[propPath[0]]){
            updateObj[propPath[0]] = {};
          }
          if (!updateObj[propPath[0]][propPath[1]]) {
            updateObj[propPath[0]][propPath[1]] = midiVelocity;
          }
          updateObj[propPath[0]][propPath[1]][propPath[2]] = midiVelocity;
        }
        if (propPath.length === 4) {
          if (!updateObj[propPath[0]]){
            updateObj[propPath[0]] = {};
          }
          if (!updateObj[propPath[0]][propPath[1]]) {
            updateObj[propPath[0]][propPath[1]] = midiVelocity;
          }
          if (!updateObj[propPath[0]][propPath[1]][propPath[2]]) {
            updateObj[propPath[0]][propPath[1]][propPath[2]] = {};
          }
          updateObj[propPath[0]][propPath[1]][propPath[2]][propPath[3]] = midiVelocity;
        }
        if (Flint.collection(doc.collection).findOne(doc.selector)){
          Flint.collection(doc.collection).update(doc.selector, {$set: updateObj});
        }
      }
      if (doc.type === 'macro'){
        var macros = doc.macros;
        macros.forEach(function(e){
          Flint.collection('flintMacroPresets').find({_id:e.id}).forEach(function(macro){
            if (e.argument){
              macro.arguments[e.argument] = midiVelocity;
            }
            if (!macro.simulatorId) {
              macro.arguments.simulatorId = Flint.simulatorId();
            }
            if (!macro.stationId){
              macro.arguments.stationId = Flint.station('_id');
            }
            Flint.macro(macro.name,macro.arguments);
          });
        });
      }
    }
    Session.set('flint_midi_currentChannel', _id);
  }

  function sendMIDIMessage(midiCommand, midiNote, midiVelocity) {
    // @TODO Figure out how to address a specific MIDI input/output
    this.midiOutput.send([midiCommand, midiNote, midiVelocity]);
  }

  // Setup observers for all MIDI collection values
  this.observers = {};

  var that = this;

  this.observers.baseObserver = Flint.collection('flintMidiMappings').find({}).observe({
    added: function(doc) {
      var fieldFilter = {};
      var propPath = doc.propertyPath.split('.');
      fieldFilter[propPath[0]] = 1;
      console.log('Subscribed to:', doc.collection, doc.selector, fieldFilter);
      Meteor.subscribe('flint-midi.genericSubscriber', doc.collection, doc.selector, fieldFilter);
      //if (Flint.collection(doc.collection).findOne(doc.selector)){
        that.observers[doc._id] = Flint.collection(doc.collection).find(doc.selector, {fields: fieldFilter}).observe({
            /**
            The added and changed functions should be identical
            They take the target property,
            untransform it (so it's between 0 and 127)
            and then write it back to the MIDI device
            */
            added: function(targetDoc) {
              var midiVelocity = targetDoc[doc.propertyPath];
              if (doc.transform) {
                midiVelocity = midiTransformInverse[doc.transform](midiVelocity);
              }
              sendMIDIMessage(doc.midiCommand, doc.midiNote, midiVelocity);
            },
            changed: function(targetDoc) {
              var midiVelocity = targetDoc[doc.propertyPath];
              if (doc.transform) {
                midiVelocity = midiTransformInverse[doc.transform](midiVelocity);
              }
              sendMIDIMessage(doc.midiCommand, doc.midiNote, midiVelocity);
            }
          });
     // }
   },
   removed: function(doc) {
    that.observers[doc._id].stop();
  }
});
});

Template.comp_flint_midi.onDestroyed(function() {
  _.each(_.values(this.observers), function(obs) {
    obs.stop();
  });
});
