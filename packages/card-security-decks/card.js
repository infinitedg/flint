Template.card_security_decks.rendered = function () {
	$('#amplitude').slider();
	Session.setDefault("securityDecks_currentDeck",1);
};

Template.card_security_decks.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
		Meteor.subscribe('simulator.hallways', Flint.simulatorId());
	});
};
Template.card_security_decks.events({
	'slide #amplitude': function (e) {
		Session.set("securityDecks_currentDeck", e.target.value);
	},
	'mousemove path':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		if (room)
			Session.set('hovered_room',room.name);
		else
			Session.set('hovered_room',null);
	},
	'mousemove rect':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		if (room)
			Session.set('hovered_room',room.name);
		else
			Session.set('hovered_room',null);
	}
});
Template.card_security_decks.helpers({
	decks: function () {
		return Flint.collection('decks').find();
	},
	rooms: function(){
		return Flint.collection('rooms').find({deck:this._id});
	},
	deckHallway: function(){
		var hallway = Flint.collection('hallways').findOne({deck:this._id});
		if (hallway)
			return hallway.svgPath;
	},
	deckTemplate: function(){
		var deckPlansId = Flint.simulator('deckPlansId') || Flint.simulatorId();
		return deckPlansId + "_deck_" + this.number;
	},
	deckState: function(){
		if (this.number > Session.get("securityDecks_currentDeck")){
			return false;
		}
		if (this.number == Session.get("securityDecks_currentDeck")){
			return "up";
		}
		if (this.number < Session.get("securityDecks_currentDeck")){
			return "down";
		}
	},
	/*currentDeck: function(){
		return Session.get("securityDecks_currentDeck");
	},
	deckCount: function(){
		return Flint.collection('decks').find().count();
	},*/
	hoveredRoom: function(){
		return Session.get('hovered_room')
	}

});