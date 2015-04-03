Template.card_quartermaster.rendered = function () {
	$('#suppliesLeftSlide').slider();
	$('#suppliesRightSlide').slider();
	Session.setDefault("quartermaster_currentDeck_right",1);
	Session.setDefault("quartermaster_currentDeck_left",1);
};

Template.card_quartermaster.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
		Meteor.subscribe('simulator.hallways', Flint.simulatorId());
		Meteor.subscribe('simulator.inventoryItems', Flint.simulatorId());
	});
	Session.setDefault("hovered_room",{});
};
Template.card_quartermaster.events({
	'slide #suppliesLeftSlide': function (e) {
		Session.set("quartermaster_currentDeck_left", e.target.value);
	},
	'slide #suppliesRightSlide': function (e) {
		Session.set("quartermaster_currentDeck_right", e.target.value);
	},
	'mousemove path':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		var position = {x:e.clientX,y:e.clientY};
		if (room)
			Session.set('hovered_room',{name:room.name,position:position});
		else
			Session.set('hovered_room',{});	
	},
	'mouseleave path':function(e){
		Session.set('hovered_room',{});	
	},
	'mousemove rect':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		var position = {x:e.clientX,y:e.clientY};
		if (room)
			Session.set('hovered_room',{name:room.name,position:position});
		else
			Session.set('hovered_room',{});	
	},
	'click path':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		if (room)
			Session.set('selectedRoom',room._id);
		else
			Session.set('selectedRoom',null);
	}
});
Template.card_quartermaster.helpers({
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
	deckStateLeft: function(){
		if (this.number > Session.get("quartermaster_currentDeck_left")){
			return false;
		}
		if (this.number == Session.get("quartermaster_currentDeck_left")){
			return "up";
		}
		if (this.number < Session.get("quartermaster_currentDeck_left")){
			return "down";
		}
	},
	deckStateRight: function(){
		if (this.number > Session.get("quartermaster_currentDeck_right")){
			return false;
		}
		if (this.number == Session.get("quartermaster_currentDeck_right")){
			return "up";
		}
		if (this.number < Session.get("quartermaster_currentDeck_right")){
			return "down";
		}
	},
	roomClass: function(){
		var output = " ";
		if (this.inventory)
			output += "inventory "
		return output;
	},
	roomName: function(){
		return Session.get("hovered_room").name;
	},
	roomStyle: function(){
		if (Session.get("hovered_room").position)
			return "top:" + (Session.get("hovered_room").position.y - 100) + "px; left:" + (Session.get("hovered_room").position.x - 100) + "px;";
	},

	/*currentDeck: function(){
		return Session.get("securityDecks_currentDeck");
	},
	deckCount: function(){
		return Flint.collection('decks').find().count();
	},*/
	leftInventory: function(){
		return Flint.collection('inventoryItems').find({room:Session.get('selectedRoom')}).fetch();
	}

});