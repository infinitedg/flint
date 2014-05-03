Meteor.publish('cards.card-sensor3d.contacts', function(simulatorId) {
	return Flint.collection('sensorContacts').find({ simulatorId: simulatorId});
});