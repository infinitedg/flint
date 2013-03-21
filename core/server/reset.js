var Flint = Flint || {};
(function() {
  "use strict";
  
  Flint.reset = function(simulatorId) {
    
    //
    // reset database
    //
    
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
          if (! _.has(doc, "simulatorId") && fixture.simulatorId)
            _.extend(doc, { "simulatorId": fixture.simulatorId });
            
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

  // XXX Reset the server on startup for now. Later server reset should only
  // occur if a collection that shouldn't be empty is empty (like the simulators
  // list).
  Meteor.startup(function() {
    Flint.reset();
  });
}());