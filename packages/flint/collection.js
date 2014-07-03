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
  name = name.toLowerCase(); // Ensure consistent naming of our collections

	Flint.Log.verbose("Retrieving collection " + name);
	if (! _.has(Flint.collections, name))
		Flint.collections[name] = new Meteor.Collection(name);
	return Flint.collections[name];
};

// Aliases for frequently referenced items

Flint.stations = Flint.collection("stations");
Flint.simulators = Flint.collection("simulators");

Flint.simulator = function(p, v) {
  if (!p && !v)
    return Flint.simulators.findOne(Session.get("flint.simulatorId"));
  if (p && !v)
    return Flint.simulators.findOne(Session.get("flint.simulatorId"))[p];
  if (p && v) {
    var setter = {};
    setter[p] = v;
    return Flint.simulators.update(Flint.simulatorId(), {$set: setter});
  }
};

Flint.simulatorId = function() {
  return Session.get("flint.simulatorId");
};

Flint.station = function() {
  return Flint.stations.findOne(Session.get("flint.stationId"));
};

Flint.stationId = function() {
  return Session.get("flint.stationId");
};

Flint.card = function() {
  var station = Flint.station();
  if (station)
    return station.cards[Session.get("flint.cardNumber")];
}

Flint.cardNumber = function() {
  return Session.get("flint.cardNumber");
};

Flint.cardId = function() {
  var card = Flint.card() || {};
  return card.cardId;
}