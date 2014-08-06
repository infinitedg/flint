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
Flint.systems = Flint.collection("systems");


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
Flint.system = function(p, q, v) {
  if (!p && !q && !v)
    return Flint.systems.find({'simulatorId': Session.get("flint.simulatorId")}).fetch();
  if (p && !q && !v)
    return Flint.systems.findOne({'simulatorId': Session.get("flint.simulatorId"), 'name': p});
  if (p && q && !v)
    return Flint.systems.findOne({'simulatorId': Session.get("flint.simulatorId"), 'name': p})[q];
  if (p && q && v) {
    var setter = Flint.systems.findOne({'simulatorId': Session.get("flint.simulatorId"), 'name': p});
    setter[q] = v;
    var id = setter._id;
    delete setter._id;
    return Flint.systems.update(id, {$set: setter});
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