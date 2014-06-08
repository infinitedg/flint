/**
 * Generate URL to a given asset name based on the current simulator
 * May want to expand this to support various asset types, 
 * to be a bit smarter in how it handles things.
*/
Flint.a = function(assetName) {
	var s = Flint.simulator()._id,
	prefix = '/packages/assets-';

	return prefix + s + '/' + assetName;
};

Meteor.startup(function(){
	UI.registerHelper('asset', function(assetName){
		return Flint.a(assetName);
	});
});