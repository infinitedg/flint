Meteor.startup(function() {
	Tracker.autorun(function(){
		Meteor.subscribe('flint.flint-assets.simulator', Flint.simulatorId());
		Meteor.subscribe('fs.flint-assets.simulator', Flint.simulatorId());
	});
});