Flint = this.Flint || {};

Flint.collections = {
  "simulators": Flint.simulators,
  "stations": Flint.stations,
  "clients": Flint.clients
};

/**
 * Wrapper to create collections, enables us to track collections dynamically.
 * @param {String} name Name of collection to be created
 */
Flint.collection = function(name) {
  if (! _.has(Flint.collections, name))
    Flint.collections[name] = new Meteor.Collection(name);
  return Flint.collections[name];
};
