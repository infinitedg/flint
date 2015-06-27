Meteor.publish("flint.localization", function(l){
	return Flint.collection('FlintLocalizations').find({ $or: [{locale: l}, {locale: Flint._defaultLocale}]});
});
