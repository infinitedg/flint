Template.card_security_doors.created = function(){
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
	});
	Session.set('security-currentDeck',(Flint.simulatorId() + "-deck-1"));

};

Template.card_security_doors.rendered = function(){
	var currentRoom = Flint.collection('rooms').find({'deck':Flint.simulatorId() + "-deck-1"},{sort:{'name':1}}).fetch()[0];
	console.log(currentRoom);
	var id = currentRoom._id;
	Session.set('security-currentRoom',id);
};

Template.card_security_doors.helpers({
	decks : function(){
		return Flint.collection('decks').find({},{sort:{'number': 1}});
	},
	rooms : function(){
		var currentDeck = Session.get('security-currentDeck');
		return Flint.collection('rooms').find({'deck':currentDeck});
	},
	doorsButtonLabel :function(){
		if (Flint.collection('decks').findOne(Session.get('security-currentDeck')).doors == 'false')
			return "Close Bulkhead Doors";
		else
			return "Open Bulkhead Doors";
	},
	evacButtonLabel : function(){
		if (Flint.collection('decks').findOne(Session.get('security-currentDeck')).evac == 'false')
			return "Evacuate Deck";
		else
			return "Return Personnel";
	},
	tranzineButtonLabel : function(){
		if (Flint.collection('rooms').findOne(Session.get('security-currentRoom')).tranzine == 'true')
			return "Vent Tranzine Gas";
		else
			return "Release Tranzine Gas";
	}

});

Template.card_security_doors.events({
	'click .deckSidebar p': function(e,t){
		Session.set('security-currentDeck',this._id);
		Session.set('security-currentRoom',Flint.collection('rooms').find({'deck':this._id},{sort:{'name':1}}).fetch()[0]._id);
	},
	'click .doorsControl':function(){
		var currentDeck = Flint.collection('decks').findOne(Session.get('security-currentDeck'));
		if (currentDeck.doors == 'true'){
			Flint.collection('decks').update(currentDeck._id,{$set:{'doors':'false'}});
		}
		else {
			Flint.collection('decks').update(currentDeck._id,{$set:{'doors':'true'}});
		}
	},
	'click .evacControl':function(){
		var currentDeck = Flint.collection('decks').findOne(Session.get('security-currentDeck'));
		if (currentDeck.evac == 'true'){
			Flint.collection('decks').update(currentDeck._id,{$set:{'evac':'false'}});
		}
		else {
			Flint.collection('decks').update(currentDeck._id,{$set:{'evac':'true'}});
		}
	},
	'click .tranzineControl':function(){
		var currentRoom = Flint.collection('rooms').findOne(Session.get('security-currentRoom'));
		if (currentDeck.tranzine == 'true')
			Flint.collection('rooms').update(currentRoom._id,{$set:{'tranzine':'false'}});
		else
			Flint.collection('rooms').update(currentRoom._id,{$set:{'tranzine':'true'}});
	},
});

Template.securityStatus.created = function(){
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
	});
	Session.set('security-currentDeck',(Flint.simulatorId() + "-deck-1"));
};

Template.securityStatus.helpers({
	currentDeckNumber : function(){
		return Flint.collection('decks').findOne(Session.get('security-currentDeck')).number;
	},
	currentDeckDoors : function(){
		if (Flint.collection('decks').findOne(Session.get('security-currentDeck')).doors == 'false')
			return "Open";
		else
			return "Closed";
	},
	currentDeckEvac : function(){
		if (Flint.collection('decks').findOne(Session.get('security-currentDeck')).evac == 'false')
			return "On Duty";
		else
			return "Evacuated";
	}
});
