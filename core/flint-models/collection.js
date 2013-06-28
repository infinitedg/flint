Flint = this.Flint || {};

Flint.collections = {};

/**
 * Wrapper to create collections, enables us to track collections dynamically.
 * @param {String} name Name of collection to be created
 */
Flint.collection = function(name) {
  if (! _.has(Flint.collections, name))
    Flint.collections[name] = new Meteor.Collection(name);
  return Flint.collections[name];
};

Systems = Flint.collection('simulators');
SensorContacts = Flint.collection('stations');
Participants = Flint.collection('clients');
