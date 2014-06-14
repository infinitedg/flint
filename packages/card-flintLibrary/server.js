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

Meteor.publish("flint.assets.simulators", function() {
	return Flint.collection('simulators').find();
});