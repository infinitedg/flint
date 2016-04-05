Meteor.publish("flint-midi.flintMidiMappings", function() {
	return [Flint.collection('flintMidiMappings').find(),Flint.collection('flintMidiMessages').find()];
});

// Used to ensure that targeted objects are available on the client
Meteor.publish("flint-midi.genericSubscriber", function(collection, selector, fieldFilter) {
	return Flint.collection(collection).find(selector);//, {fields: fieldFilter});
});

Meteor.publish("flint-midi.collections", function() {
	var self = this;
	var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
	db.collectionNames(
		function(err, results) {
			if (err) throw new Meteor.Error(500, err);
			results.forEach(function(e){
				self.added("flintCollections",Random.id(),e);
			});
			self.ready();
		});
});
