Template.core_security_doors.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
	});
}
Template.core_security_doors.helpers({
	decks:function(){
		return Flint.collection('decks').find();
	},
	evacState:function(){
		if (this.evac == "true"){
			return 'evacuated';
		}
	},
	doorsState:function(){
		if (this.doors == "true"){
			return 'doors';
		}
	}
})