/**
* @class Flint
*/
Flint = this.Flint || {};

/**
* Reset the database (available only on the server).
* @method reset
* @param {String} [simulatorId] The simulator to reset. If not provided, all simulators are reset **and** all actors are restarted.
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

/**
@class Meteor.startup
*/

/**
 When we start the server, if we do not have simulator documents then we should reset the database and load all fixtures.
@method flint-models/reset.js
*/
Meteor.startup(function() {
  if (Flint.simulators.find().count() === 0) {
    Flint.Log.verbose('No simulator documents -- loading fixtures for first run...', 'flint-models');
    Flint.reset();
  }
});

/**
* @class Meteor.call
*/

/**
* Trigger a database reset from a client
* @method reset
* @param {String} [simulatorId] The Simulator's ID
* @example
*     // Reset just the `voyager`
*     Meteor.call("reset", "voyager-id");
* @example
*     // Reset all simulators
*     Meteor.call("reset");
*/
Meteor.methods({
  "reset" : Flint.reset
});