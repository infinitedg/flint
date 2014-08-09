Meteor.publish('cards.shortRangeComm.hails', function(simulatorId) {
	return Flint.collection('currentHails').find({ simulatorId: simulatorId});
});