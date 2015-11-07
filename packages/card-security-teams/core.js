Template.core_security_teams.created = function(){
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('simulator.crew', Flint.simulatorId());
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
	});
};

Template.core_security_teams.helpers({
	securityAssigned:function(){
		return Flint.collection('crew').find({
			"position":{$in:["Security","Deputy Chief Of Security","Chief Of Security"]},
			'assignment':{$exists:true},
		},{sort:{"lastName":1}});
	},
	recallRequests:function(){
		return Flint.collection('crew').find({
			"position":{$in:["Security","Deputy Chief Of Security","Chief Of Security"]},
			'assignment':{$exists:true},
			'recall':'true'
		},{sort:{"lastName":1}});
	},
	location:function(){
		var officer = Session.get('security-selectedOfficer');
		if (typeof officer.assignment != 'undefined'){
			var deck = Flint.collection('decks').findOne({'_id':officer.assignment.deck});
			if (typeof officer.assignment.room != 'undefined'){
				var room = Flint.collection('rooms').findOne({'_id':officer.assignment.room});
				return room.name + ", " + "Deck " + deck.number;
			} else {
				return "Deck " + deck.number;
			}
		}
	},
	orders:function(){
		var officer = Session.get('security-selectedOfficer');
		if (typeof officer.assignment != 'undefined'){
			return officer.assignment.orders;
		}
	}
});

Template.core_security_teams.events({
	'click .securityAssignedName':function(e,t){
		Session.set('security-selectedOfficer',this);
	},
	'click .recallRequestName':function(e,t){
		Session.set('security-selectedOfficer',this);
	},
	'click .recallOfficer':function(e,t){
		if (typeof Session.get('security-selectedOfficer')._id)
			Flint.collection('crew').update({'_id':Session.get('security-selectedOfficer')._id},
				{$unset:{'recall':'','assignment':''}});
	}
});
