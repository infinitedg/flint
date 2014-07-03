Meteor.publish('cards.card-sensorGrid.contacts', function(simulatorId) {
	return Flint.collection('sensorContacts').find({ simulatorId: simulatorId});
});