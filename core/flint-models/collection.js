Flint = this.Flint || {};
(function() {
  "use strict";
  Flint.collections = {
    "simulators": Flint.simulators,
    "stations": Flint.stations,
    "clients": Flint.clients
  };
  Flint.collection = function(name) {
    if (! _.has(Flint.collections, name))
      Flint.collections[name] = new Meteor.Collection(name);
    return Flint.collections[name];
  };
}());
