// @TODO Focus down to assets for a given simulator
Meteor.publish("fs.flintassets", function() {
	return Flint.FS.collection('flintAssets').find();
});
Meteor.publish("flint.flintassets", function() {
	return Flint.collection('flintAssets').find();
});