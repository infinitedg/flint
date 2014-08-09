Meteor.publish('cards.card-tacControl.symbols', function(simulatorId) {
	return Flint.collection('tacSymbols').find({ simulatorId: simulatorId});
});

Meteor.publish('cards.card-tacControl.contacts', function(simulatorId) {
	return Flint.collection('tacticalContacts').find({ simulatorId: simulatorId});
});

Meteor.publish('cards.card-tacControl.screencontacts', function(simulatorId) {
	return Flint.collection('tacticalScreenContacts').find({ simulatorId: simulatorId});
});