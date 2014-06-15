Meteor.publish("flint.assets", function(currentDirectory) {
	if (currentDirectory === undefined) {
		return Flint.collection('flintAssets').find({parentObject: {$exists: 0}});
	} else {
		return Flint.collection('flintAssets').find(
			{$or: [
				{parentObject: currentDirectory},
				{_id: currentDirectory}
			]});
	}
});

Meteor.publish("flint.assets.objects", function(currentDirectory) {
	var assets;
	if (currentDirectory === undefined) {
		assets = Flint.collection('flintAssets').find({parentObject: {$exists:0}, type: "asset"});
	} else {
		assets = Flint.collection('flintAssets').find(
			{
				$or: [
					{parentObject: currentDirectory},
					{_id: currentDirectory}
				],
				type: "asset"
		});
	}

	// Enumerate objects stored in these assets
	var objects = [];
	assets.forEach(function(asset) {
		if (asset.defaultObject) {
			objects.push(asset.defaultObject);
		}
		if (asset.objects) {
			for (var obj in asset.objects) {
				objects.push(asset.objects[obj]);
			}
		}
	});

	return Flint.FS.collection('flintAssets').find({_id: {$in: objects}});
});

Meteor.publish("flint.assets.simulators", function() {
	return Flint.collection('simulators').find();
});