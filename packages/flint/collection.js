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
 * @param [String] remoteName Name of remote server key to connect with
 */
Flint.collection = function(name, remoteName) {
	name = name.toLowerCase(); // Ensure consistent naming of our collections
	Flint.Log.verbose('Retrieving collection ' + name);
	if (! _.has(Flint.collections, name)) {
		Flint.collections[name] = new Meteor.Collection(name, {connection: Flint.remote(remoteName) });
	}
	return Flint.collections[name];
};

// Aliases for frequently referenced items

Flint.stations = Flint.collection('stations');
Flint.simulators = Flint.collection('simulators');
Flint.systems = Flint.collection('systems');
Flint.clients = Flint.collection('flintClients');