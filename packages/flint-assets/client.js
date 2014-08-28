Meteor.startup(function() {
	Deps.autorun(function(){
		Meteor.subscribe('flint.flint-assets.simulator', Flint.simulatorId());
		Meteor.subscribe('fs.flint-assets.simulator', Flint.simulatorId());
	});
})