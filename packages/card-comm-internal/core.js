Template.core_internalComm.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
	});
	Session.set('internalComm-currentDeck','')
}
Template.core_internalComm.helpers({
	decks : function(){
		return Flint.collection('decks').find();
	},
	rooms : function(){
		var currentDeck = Flint.simulatorId() + "-deck-" + Session.get('internalComm-core-currentDeck');
		return Flint.collection('rooms').find({'deck':currentDeck});
	},
	currentCall: function(){
		return Flint.system('Internal Communications', 'currentCall');
	},
	callControlLabel: function(){
		var state = Flint.system('Internal Communications','state');
		if (state == "idle") return "CALL";
		if (state == "connected") return "DISCONNECT";
	}
});
Template.core_internalComm.events({
	'change .deck': function(e,t){
		Session.set('internalComm-core-currentDeck',e.target.value);
	},
	'change .room': function(e,t){
		Session.set('internalComm-core-currentRoom',e.target.value);
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
	}
})