Template.card_internalComm.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
	});
	Session.set('internalComm-currentDeck','')
}
Template.card_internalComm.helpers({
	decks : function(){
		return Flint.collection('decks').find({},{sort:{'number': 1}});
	},
	rooms : function(){
		var currentDeck = Flint.simulatorId() + "-deck-" + Session.get('internalComm-currentDeck');
		return Flint.collection('rooms').find({'deck':currentDeck});
	},
	showAllDecks : function(){
		var type = Flint.system('Internal Communications','connectionType');
		if (type == "" || type == "all") return null;
		else return "not-shown";
	},
	showDeckSelect : function(){
		var type = Flint.system('Internal Communications','connectionType');
		if (type == "" || type == "deck" || type == "room") return null;
		else return "not-shown";
	},
	showRooms : function(){
		var type = Flint.system('Internal Communications','connectionType');
		if (type == "" || type == "room") return null;
		else return "not-shown";
	},
	connectionState : function(){
		var state = Flint.system('Internal Communications','state');
		if (state == "idle") return "CALL";
		if (state == "connected") return "DISCONNECT";
	},
	connected : function(){
		var state = Flint.system('Internal Communications','state');
		if (state == "idle") return null;
		if (state == "connected") return "connected";
	},
	currentConnection : function(){
		return Flint.system('Internal Communications', 'currentCall');
	}
});
Template.card_internalComm.events({
	'change .deck': function(e,t){
		Session.set('internalComm-currentDeck',e.target.value);
	},
	'change .room': function(e,t){
		Session.set('internalComm-currentRoom',e.target.value);
	},
	'click .connect': function(e,t){
		if (Flint.system('Internal Communications','state') == 'idle'){
			var type;
			var connection;
			var deckState = t.find('.deck').value;
			var roomState = t.find('.room').value;
			if (deckState != "Deck"){
				type = 'deck';
				connection = "Deck " + deckState;
			}
			if (roomState != "Room"){
				type = 'room';
				connection = roomState + ", Deck " + deckState;
			} 
			Flint.system('Internal Communications','state','connected');
			Flint.system('Internal Communications','connectionType',type);
			Flint.system('Internal Communications','currentCall',connection);
		} else {
			Flint.system('Internal Communications','state','idle');
			Flint.system('Internal Communications','connectionType','');
			Flint.system('Internal Communications','currentCall','');
		}
	},
	'click .allDecks': function(e,t){
		Flint.system('Internal Communications','state','connected');
		Flint.system('Internal Communications','connectionType','all');
		Flint.system('Internal Communications','currentCall','All Decks');
	}
})