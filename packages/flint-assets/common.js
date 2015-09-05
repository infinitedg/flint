Flint.Asset = {
	// Return URL of asset for key
	urlForKey: function(assetKey) {
		var obj = Flint.Asset.objectForKey(assetKey) || {};
		return obj.url;
	},
	// Return asset object for key
	objectForKey: function(assetPath, simulatorId) {
		if (!simulatorId && Meteor.isClient) {
			simulatorId = Flint.simulatorId();
		}
		// Get the default object first
		var defObj = Flint.collection('flintAssetObjects').findOne({folderPath: assetPath, simulatorId: {$exists: false}});
		//if (defObj) {
			var simObj, assetObj;
			if (simulatorId) {
				simObj = Flint.collection('flintAssetObjects').findOne({folderPath: assetPath, simulatorId: simulatorId});
			}

			if (simObj) {
				assetObj = simObj;
			} else {
				assetObj = defObj;
			}
			if (!assetObj)
				return false;
			var obj = Flint.FS.collection('flintAssets').findOne(assetObj.objectId);
			
			if (obj) {
				// @TODO use obj.url() or other CFS-internal mechanism to retrieve non-proxied URL
				assetObj.url = Meteor.settings.public.assets.s3base + obj.copies.flintassets.key;
				
				if (obj.isVideo()) {
					assetObj.mimeType = "video";
				} else if (obj.isImage()) {
					assetObj.mimeType = "image";
				} else if (obj.isAudio()) {
					assetObj.mimeType = "audio";
				}

				assetObj.object = obj;

				return assetObj;
			} else {
				Flint.Log.error("Asset " + assetPath + " has no object");
			}
		//}
	},
	// Return folder object for key
	folderForKey: function(folderKey) {
		var folder = Flint.collection('flintAssetFolders').findOne({fullPath: folderKey});
		if (!folder) {
			var object = Flint.Asset.objectForKey(folderKey) || {};
			folder = Flint.collection('flintAssetFolders').findOne({fullPath: object.folderPath});
		}
		if (!folder && folderKey !== "/" && folderKey !== "") {
			Flint.Log.error("Unknown folder for key " + folderKey, "flint-assets");
			return;
		}

		return folder;
	},
	// Container for key
	containerForKey: function(folderKey) {
		var container = Flint.collection('flintAssetContainers').findOne({fullPath: folderKey});
		if (!container) {
			Flint.Log.error("Attempt to retrieve non-existent container " + folderKey, "flint-assets");
			return;
		}

		return container;
	},
	// Return all objects within the folder
	listFolder: function(folderKey) {
		var folder = Flint.Asset.folderForKey(folderKey);

		// Sneaky way to setup a workable query for root objects
		if (!folder) {
			folder = {
				_id: {$exists: false}
			};
		}

		// Get all containers and folders
		return {
			containers: Flint.collection('flintAssetContainers').find({folderId: folder._id}).fetch(), 
			folders: Flint.collection('flintAssetFolders').find({parentFolderId: folder._id}).fetch()
		};
	},
	// Set asset for key (and optional simulator, defaults to default object)
	setAsset: function(assetPath, fsFile, simulatorId) {
		var asset = Flint.FS.insert(fsFile, function(err, fileObj) {
			if (fileObj) {
				if (!simulatorId) {
					simulatorId = {$exists: false};
				}
				var container = Flint.Asset.containerForKey(assetPath);
				Flint.collection('flintAssetObjects').upsert({
					simulatorId: simulatorId, 
					containerId: container._id},
					{
						$set: {objectId: fileObj._id}
					});
			} else {
				Flint.Log.error(err, "flint-assets");
			}
		});
	},
	// Create a folder at a given base path
	addFolder: function(basePath, folderName) {
		if (!folderName) { // Assume the last item in this is what we're going for
			var basePathParts = basePath.split('/');
		folderName = basePathParts.pop();
		basePath = basePathParts.join('/');
	}

		// Existing folder search
		var existingPath = basePath.split('/');
		existingPath.push(folderName);
		existingPath = existingPath.join('/');
		if (Flint.collection('flintAssetFolders').find({fullPath: existingPath}).count() > 0) {
			Flint.Log.error("Folder at " + existingPath + " already exists", "flint-assets");
			return;
		}

		var parentFolder = Flint.Asset.folderForKey(basePath),
		statement = {
			name: folderName
		};
		if (parentFolder) { // Not root folder
			statement.parentFolderId = parentFolder._id;
		}
		return Flint.collection('flintAssetFolders').insert(statement);
	},
	// Remove folder
	// Will throw an error if the folder has any children
	removeFolder: function(basePath) {
		var folder = Flint.Asset.folderForKey(basePath);
		if (!folder) {
			Flint.Log.error("Unknown folder " + basePath);
			return;
		}

		if (Flint.collection('flintAssetContainers').find({folderId: folder._id}).count() > 0 ||
			Flint.collection('flintAssetFolders').find({parentFolderId: folder._id}).count() > 0) {
			Flint.Log.error("Attempting to remove folder " + basePath + " when not empty", "flint-assets");
		return;
	}

	Flint.collection('flintAssetContainers').remove({_id: folder._id});
}
};

Flint.a = Flint.Asset.urlForKey;

Meteor.startup(function(){
	UI.registerHelper('asset', function(assetKey){
		return Flint.a(assetKey);
	});

	if (Meteor.isClient) {
		Meteor.subscribe('fs.flintassets');
		Meteor.subscribe('flint.flintassets');
		Meteor.subscribe('flint.flint-assets.all');
		Meteor.subscribe("flint.assets.objects.all");
		Meteor.subscribe("flint.assets.containers.all");
		Meteor.subscribe("flint.assets.folders.all");
		Meteor.subscribe("fs.flint-assets.all");
	}
});

