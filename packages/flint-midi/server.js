Meteor.publish("flint-midi.flintMidiMappings", function() {
  return Flint.collection('flintMidiMappings').find();
});

// Used to ensure that targeted objects are available on the client
Meteor.publish("flint-midi.genericSubscriber", function(collection, selector, fieldFilter) {
  return Flint.collection(collection).find(selector, {fields: fieldFilter});
});
