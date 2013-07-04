Flint = this.Flint || {};

// @TODO: Consider making `Flint.collections` reactive.

/**
* Hashmap of collections, used by `Flint.collection`
* Provides a simple interface for iterating over collections in the system
* @property collections
* @type Object
*/
Flint.collections = {
  "simulators": Flint.simulators,
  "stations": Flint.stations,
  "clients": Flint.clients
};

/**
 * Wrapper to create collections, enables us to track collections dynamically.
 * @method collection
 * @param {String} name Name of collection to be created
 */
Flint.collection = function(name) {
  if (! _.has(Flint.collections, name))
    Flint.collections[name] = new Meteor.Collection(name);
  return Flint.collections[name];
};
