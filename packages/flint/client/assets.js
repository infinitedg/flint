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

Flint.a = function(assetKey) {
	var a = Flint.collection('flintAssets').findOne({fullPath: assetKey});
	if (a) {
		var obj = Flint.FS.collection('flintAssets').findOne(objIdForAsset(a));
		
		if (obj) {
			return obj.url();
		}
	}
};

Meteor.startup(function(){
	UI.registerHelper('asset', function(assetKey){
		return Flint.a(assetKey);
	});

	if (Meteor.isClient) {
		Meteor.subscribe('fs.flintassets');
		Meteor.subscribe('flint.flintassets');
	}
});

