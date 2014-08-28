// @TODO Focus down to assets for a given simulator
Meteor.publish("fs.flint-assets.all", function() {
	return Flint.FS.collection('flintAssets').find();
});
Meteor.publish("flint.flint-assets.all", function() {
	return Flint.collection('flintAssets').find();
});

// Return only the folders, containers, and objects for this simulator
Meteor.publish('flint.flint-assets.simulator', function(simulatorId) {
	var mappedObjects = {};

	// Make a list of all objects and their containers
	Flint.collection('flintAssetObjects')
		.find({$or: [{simulatorId: {$exists: false}}, {simulatorId: simulatorId}]})
		.forEach(function(obj) {
			if (!mappedObjects[obj.containerPath]) {
				mappedObjects[obj.containerPath] = {
					objectId: obj._id,
					containerId: obj.containerId,
				};
			} else if (mappedObjects[obj.containerPath] && obj.simulatorId) {
				mappedObjects[obj.containerPath] = {
					objectId: obj._id,
					containerId: obj.containerId,
				};
			}
		});

	// Use this list to get all our folders too
	mappedObjects = _.map(mappedObjects, function(obj, key) {
		var container = Flint.collection('flintAssetContainers').findOne({_id: obj.containerId});
		return _.extend(obj, {folderId: container.folderId});
	});

	// Convert to an array
	var condensedObjects = _.values(mappedObjects);

	// Create arrays to hold the IDs of the appropriate objects
	var containerIds 	= _.pluck(condensedObjects, "containerId");
	var objectIds 		= _.pluck(condensedObjects, "objectId");
	var folderIds 		= _.pluck(condensedObjects, "folderId");
	
	return [
		Flint.collection('flintAssetFolders').find({_id: {$in: folderIds}}), 
		Flint.collection('flintAssetContainers').find({_id: {$in: containerIds}}),
		Flint.collection('flintAssetObjects').find({_id: {$in: objectIds}})
	];
});

// Return only the asset objects for this simulator
Meteor.publish('fs.flint-assets.simulator', function(simulatorId) {
	var mappedObjects = {};

	// Make a list of all objects and their containers
	Flint.collection('flintAssetObjects')
		.find({$or: [{simulatorId: {$exists: false}}, {simulatorId: simulatorId}]})
		.forEach(function(obj) {
			// Setup objects, replacing if we find a simulator-specific default
			if (!mappedObjects[obj.containerPath]) {
				mappedObjects[obj.containerPath] = obj.objectId;
			} else if (mappedObjects[obj.containerPath] && obj.simulatorId) {
				mappedObjects[obj.containerPath] = obj.objectId;
			}
		});

	// Return the values that we get back
	return Flint.FS.collection('flintAssets').find({_id: {$in: _.values(mappedObjects)}});
});

// Recursive function to walk up the tree to the parent object
function _pathPartsForFolder(folderId, existingPath, pathsTraversed) {
	if (!existingPath) {
		existingPath = [];
	}

	if (!pathsTraversed) { // Prevent runaway loops
		pathsTraversed = {};
	}

	if (pathsTraversed[folderId]) {
		Flint.Log.error("Loop detected in folder hierarchy, stopping traversal at " + existingPath, "flint-assets");
		return;
	}

	pathsTraversed[folderId] = true;

	if (folderId !== undefined) {
		var folder = Flint.collection('flintAssetFolders').findOne(folderId);
		if (!folder) {
			Flint.Log.error("No such folder " + folderId, "flint-assets");
			return;
		}

		existingPath.unshift(folder.name);

		if (folder.parentFolderId) {
			return _pathPartsForFolder(folder.parentFolderId, existingPath, pathsTraversed);
		}
	}

	return existingPath;
}

function _pathPartsForContainer(assetId) {
	var asset = Flint.collection('flintAssetContainers').findOne(assetId);
	return _pathPartsForFolder(asset.folderId, [asset.name]);
}

function _pathPartsForObject(objectId) {
	var object = Flint.collection('flintAssetObjects').findOne(objectId);
	return _pathPartsForContainer(object.containerId, [":" + object.simulatorId]);
}

function _pathForParts(parts) {
	return "/" + parts.join('/');
}

function _shortPathForParts(parts) {
	parts.pop();
	return "/" + parts.join('/');
}

// Setup observers for constructing denormalized asset properties
/**
Observer chains:

folder.name 			=> folder.fullPath
folder.parentFolderId	=> folder.fullPath
folder.fullPath			=> folder.folderPath
folder.fullPath			=> container.folderPath
**/

function updateFolderDependencies(id) {
	var pathParts = _pathPartsForFolder(id),
		fullPath = _pathForParts(pathParts),
		shortPath = _shortPathForParts(pathParts);

	Flint.collection('flintAssetFolders').update(id, {$set: {fullPath: fullPath, folderPath: shortPath}});
	Flint.collection('flintAssetContainers').update({folderId: id}, {$set: {folderPath: fullPath}}, {multi: true});
}


Flint.collection('flintAssetFolders').find({}, {fields: {name: 1, parentFolderId: 1, fullPath: 1}})
.observeChanges({
	added: function(id, fields) {
		updateFolderDependencies(id);
	},
	changed: function(id, fields) {
		updateFolderDependencies(id);
	},
	removed: function(id) {
		Flint.collection('flintAssetContainers').remove({folderId: id});
	}
});

/**
container.folderId		=> container.fullPath
container.name 			=> container.fullPath
container.fullPath		=> container.folderPath
container.fullPath		=> object.folderPath
*/

function updateContainerDependencies(id) {
	var pathParts = _pathPartsForContainer(id),
		fullPath = _pathForParts(pathParts),
		shortPath = _shortPathForParts(pathParts);

	Flint.collection('flintAssetContainers').update(id, {$set: {fullPath: fullPath, folderPath: shortPath}});
	Flint.collection('flintAssetObjects').update({containerId: id}, {$set: {folderPath: fullPath}}, {multi: true});
}

Flint.collection('flintAssetContainers').find().observeChanges({
	added: function(id, fields) {
		updateContainerDependencies(id);
	},
	changed: function(id, fields) {
		updateContainerDependencies(id);
	},
	removed: function(id) {
		Flint.collection('flintAssetObjects').remove({containerId: id});
	}
});

/**
object.containerId		=> object.fullPath
object.folderPath		=> object.fullPath
*/

function updateObjectDependencies(id) {
	var object = Flint.collection('flintAssetObjects').findOne(id);
	var containerParts = _pathPartsForContainer(object.containerId),
		fullPath = _pathForParts(containerParts),
		shortPath = _shortPathForParts(containerParts),
		objectParts = _pathPartsForObject(id),
		objectPath = _pathForParts(objectParts);

	Flint.collection('flintAssetObjects').update(id, {$set: {containerPath: fullPath, folderPath: shortPath, objectPath: objectPath}}, {multi: true});
}

Flint.collection('flintAssetObjects').find().observeChanges({
	added: function(id, fields) {
		updateObjectDependencies(id)
	},
	changed: function(id, fields) {
		updateObjectDependencies(id)
	}
});