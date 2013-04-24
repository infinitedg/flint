Flint = this.Flint || {};
(function() {
  "use strict";
  
  Flint.reset = function(simulatorId) {
    
    //
    // reset database
    //
    
    // TODO: Reset applicable documents in the simulators collection (they don't
    //       have a simulatorId key, so they aren't reset yet.)
    // TODO: Reset all stations of simulatorId
    
    if (simulatorId)
      _.each(Flint.collections, function(collection) {
        collection.remove({ simulatorId: simulatorId }, { multi: true });
      });
    else
      _.each(Flint.collections, function(collection) {
        collection.remove({});
      });
    
    
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
  
  Meteor.methods({
    "reset" : Flint.reset
  });
  
  Meteor.startup(function() {
    Flint.reset();
  });
  
}());