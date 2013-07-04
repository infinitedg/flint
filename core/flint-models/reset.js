Flint = this.Flint || {};

/**
* Reset the database
* @param {String} simulatorId The simulator to reset. If not provided, all simulators are reset.
*/
Flint.reset = function(simulatorId) {
  
  // TODO: Reset applicable documents in the simulators collection (they don't
  //       have a simulatorId key, so they aren't reset yet.)
  // TODO: Reset all stations of simulatorId
  
  if (simulatorId) {
    var simulator = Flint.simulators.findOne(simulatorId);
    Flint.Log.verbose('Resetting simulator ' + simulator.name + ' (' + simulatorId + ')', 'flint-models');
    _.each(Flint.collections, function(collection) {
      collection.remove({ simulatorId: simulatorId }, { multi: true });
    });
  }
  else {
    Flint.Log.verbose('Resetting all simulators', 'flint-models');
    _.each(Flint.collections, function(collection) {
      collection.remove({});
    });
  }
  
  
  // For each document belonging to collection in each fixture
  _.each(Flint.fixtures, function(fixture) {
    _.each(fixture, function(docs, collectionName) {
      var collection = Flint.collection(collectionName);
      _.each(docs, function(doc) {
        
        // Inherit the simulatorId key from the fixture if necessary.
        if (fixture.simulatorId) {
          if (collectionName === "simulators" && ! _.has(doc, "_id"))
            _.extend(doc, { "_id": fixture.simulatorId });
          else if (! _.has(doc, "simulatorId"))
            _.extend(doc, { "simulatorId": fixture.simulatorId });
        }
        
        // If this is a global reset, or if the documents simulatorId matches
        // the simulator we've reset, insert the document.
        if (!simulatorId || (_.has(doc, "simulatorId") && doc.simulatorId === simulatorId))
          collection.insert(doc);
      });
    });
  });
  
  //
  // Restart actors
  //
  if (!simulatorId)
    _.each(Flint.actors, function(actor) {
      actor.restart();
    });
};

// Expose `Meteor.call("reset", [simulatorId])` to clients
Meteor.methods({
  "reset" : Flint.reset
});

// When we start the server, if we do not have simulator documents then we should reset the database and load all fixtures
Meteor.startup(function() {
  if (Flint.simulators.find().count() === 0) {
    Flint.Log.verbose('No simulator documents -- loading fixtures for first run...', 'flint-models');
    Flint.reset();
  }
});
