/* exported Flint */
var Flint = Flint || {};
(function() {
  "use strict";
  
  Flint.fixtures = [];
  
  Flint.addFixture = function(fixture, simulatorId) {
    if (! _.has(fixture, "simulatorId") && simulatorId)
      _.extend(fixture, { "simulatorId": simulatorId });
    Flint.fixtures.push(fixture);
  };
}());