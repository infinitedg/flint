Meteor.publish("card.viewscreen.inputs", function(simulatorId) {
	return Flint.collection('viewscreenInputs').find({'simulatorId': simulatorId});
});