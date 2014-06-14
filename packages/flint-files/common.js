var _collections = {};

Flint.FS.registerCollection = function(name, storeName, opts) {
	if (_collections[name]) {
		throw new Meteor.Error(500, "Registering predefined FS collection", "Collection " + name + " already exists");
	}
	if (!FS.Store[storeName]) {
		throw new Meteor.Error(500, "Unknown FS store", "Unkown FS store " + storeName);
	}

	_collections[name] = new FS.Collection(name, {
		stores: [new FS.Store[storeName](name, opts)]
	});
};

Flint.FS.collection = function(name) {
	if (!_collections[name]) {
		throw new Meteor.Error(500, "Requested nonexistent FS collection", "No such collection " + name);
	}
	return _collections[name];
};

if (Meteor.absoluteUrl() !== "http://flint-demo.spaceedventures.org/") {
	Flint.FS.registerCollection('flintAssets', 'FileSystem', { path: "~/flint-assets" });
} else {
	Flint.FS.registerCollection('flintAssets', 'FileSystem', { path: "~/flint-assets" });
}