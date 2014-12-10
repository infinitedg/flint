Template.card_roster.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.crew', Flint.simulatorId());
	});
}
Template.card_roster.helpers({
	'crewmembers':function(){
		return Flint.collection('crew').find({},{sort:{"lastName":1}});
	}
})