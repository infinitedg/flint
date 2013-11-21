// @TODO: Consider making `Flint.collections` reactive.

/**
* Hashmap of collections, used by `Flint.collection`
* Provides a simple interface for iterating over collections in the system
* @property collections
* @type Object
*/
Flint.collections = {};

/**
 * Wrapper to create collections, enables us to track collections dynamically.
 * @method collection
 * @param {String} name Name of collection to be created
 */
Flint.collection = function(name) {
	Flint.Log.verbose("Retrieving collection " + name);
	if (! _.has(Flint.collections, name))
		Flint.collections[name] = new Meteor.Collection(name);
	return Flint.collections[name];
};

// Aliases for frequently referenced items
Flint.simulator = function() {
  return Flint.simulators.findOne(Session.get("core.simulatorId"));
};

Flint.simulatorId = function() {
  return Session.get("core.simulatorId");
};

Flint.station = function() {
  return Flint.stations.findOne(Session.get("core.stationId"));
};

Flint.stationId = function() {
  return Session.get("core.stationId");
};

Flint.card = function() {
  var station = Flint.station();
  if (station)
    return station.cards[Session.get("core.cardId")];
}

Flint.cardId = function() {
  return Session.get("core.cardId");
}

Flint.stations = Flint.collection("stations");
Flint.simulators = Flint.collection("simulators");