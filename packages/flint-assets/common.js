/**
 * Generate URL to a given asset name based on the current simulator
 * May want to expand this to support various asset types, 
 * to be a bit smarter in how it handles things.
*/

var objIdForAsset = function(a) {
	if (a.objects && a.objects[Flint.simulatorId()]) {
		return a.objects[Flint.simulatorId()];
	} else {
		return a.defaultObject;
	}
}

Flint.Asset = {
	// Return URL of asset for key
	urlForKey: function(assetKey) {
		var a = Flint.collection('flintAssets').findOne({fullPath: assetKey});
		if (a) {
			var obj = Flint.FS.collection('flintAssets').findOne(objIdForAsset(a));
			
			if (obj) {
				return obj.url();
			}
		}
	},
	// Return asset object for key
	assetForKey: function(assetPath) {
	},
	// Return folder object for key
	folderForKey: function(folderKey) {

	},
	// Return all objects within the folder
	listFolder: function(folderKey) {

	},
	// Set asset for key (and simulator)
	setAsset: function(assetPath, fileObj, simulatorId) {

	},
	// Create a folder at a given base path
	addFolder: function(basePath, folderName) {

	},
	// Remove folder
	// Will throw an error if the folder has any children
	removeFolder: function(basePath) {

	},
	// Returns the parent folder of the asset or folder
	parentFolder: function(path) {

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
	}
});

