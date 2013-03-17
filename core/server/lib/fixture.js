/* exported Flint */
var Flint = Flint || {};
(function() {
  "use strict";
  
  var fixtures = [];
  
  Flint.addFixture = function(fixture, simulatorId) {
    if (! _.has(fixture, "simulatorId") && simulatorId)
      _.extend(fixture, { "simulatorId": simulatorId });
    fixtures.push(fixture);
  };
  
  Flint.reset = function() {
    _.each(Flint.collections, function(collection) {
      collection.remove({}, { multi: true });
    });
    
    _.each(fixtures, function(fixture) {
      _.each(fixture, function(docs, collectionName) {
        var collection = Flint.collection(collectionName);
        _.each(docs, function(doc) {
          if (! _.has(doc, "simulatorId") && fixture.simulatorId)
            _.extend(fixture, { "simulatorId": fixture.simulatorId });
          collection.insert(doc);
        });
      });
    });
  };
  
  Meteor.startup(function() {
    Flint.reset();
  });
}());