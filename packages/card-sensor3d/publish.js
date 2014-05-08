Meteor.publish('cards.card-sensor3d.contacts', function(simulatorId) {
	return Flint.collection('sensorContacts').find({ simulatorId: simulatorId});
});

Meteor.publish('cards.core-sensor3d.contacts', function(simulatorId) {
	return Flint.collection('sensorContacts').find({ simulatorId: simulatorId});
});

Meteor.publish('cards.core-sensor3d.armies', function(simulatorId) {
	return Flint.collection('armyContacts').find({ simulatorId: simulatorId});
});