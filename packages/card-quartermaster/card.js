Template.card_quartermaster.rendered = function () {
	$('#suppliesLeftSlide').slider();
	$('#suppliesRightSlide').slider();
	Session.setDefault("quartermaster_currentDeck_right",1);
	Session.setDefault("quartermaster_currentDeck_left",1);
};

Template.card_quartermaster.created = function(){
	this.subscription = Tracker.autorun(function() {
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
	'click .leftSupplies path':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		if (room)
			Session.set('leftSelectedRoom',room._id);
		else
			Session.set('leftSelectedRoom',null);
	},
	'click .rightSupplies path':function(e){
		var room = Flint.collection('rooms').findOne({_id:e.target.parentElement.dataset.id});
		if (room)
			Session.set('rightSelectedRoom',room._id);
		else
			Session.set('rightSelectedRoom',null);
	},
	'click .requisition':function(){
		$('.requisition_modal').modal();
	},
	'click .leftInventory p':function(){
		var item = Flint.collection('inventoryItems').findOne({_id:this._id});
		var roomCount = item.roomCount;
		roomCount[Session.get('leftSelectedRoom')] -= 1;
		if (typeof (roomCount['ready']) == "undefined")
			roomCount['ready'] = 0;
		roomCount['ready'] += 1;
		Flint.collection('inventoryItems').update({_id:this._id}, {$set: {roomCount:roomCount}});
	},
	'click .rightInventory p':function(){
		var item = Flint.collection('inventoryItems').findOne({_id:this._id});
		var roomCount = item.roomCount;
		roomCount[Session.get('rightSelectedRoom')] -= 1;
		if (typeof (roomCount['ready']) == 'undefined')
			roomCount['ready'] = 0;
		roomCount['ready'] += 1;
		Flint.collection('inventoryItems').update({_id:this._id}, {$set: {roomCount:roomCount}});
	},
	'click .transferRight':function(){
		var selector = {};
		selector['roomCount.ready'] = {$gt:0};
		Flint.collection('inventoryItems').find(selector).forEach(function(e){
			var roomCount = e.roomCount;
			if (typeof roomCount[Session.get('rightSelectedRoom')] == "undefined")
				roomCount[Session.get('rightSelectedRoom')] = 0;
			roomCount[Session.get('rightSelectedRoom')] += roomCount['ready'];
			roomCount['ready'] = 0;
			Flint.collection('inventoryItems').update({_id:e._id},{$set:{roomCount:roomCount}});
		});
	},
	'click .transferLeft':function(){
		var selector = {};
		selector['roomCount.ready'] = {$gt:0};
		Flint.collection('inventoryItems').find(selector).forEach(function(e){
			var roomCount = e.roomCount;
			if (typeof roomCount[Session.get('leftSelectedRoom')] == "undefined")
				roomCount[Session.get('leftSelectedRoom')] = 0;
			roomCount[Session.get('leftSelectedRoom')] += roomCount['ready'];
			roomCount['ready'] = 0;
			Flint.collection('inventoryItems').update({_id:e._id},{$set:{roomCount:roomCount}});
		});
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

	leftInventory: function(){
		var selector = {};
		selector['roomCount.' +  Session.get('leftSelectedRoom')] = {$gt:0};
		return Flint.collection('inventoryItems').find(selector);
	},
	rightInventory: function(){
		var selector = {};
		selector['roomCount.' +  Session.get('rightSelectedRoom')] = {$gt:0};
		return Flint.collection('inventoryItems').find(selector);
	},
	readyInventory:function(){
		var selector = {};
		selector['roomCount.ready'] = {$gt:0};
		return Flint.collection('inventoryItems').find(selector);
	},
	leftCount: function(){
		return this.roomCount[Session.get('leftSelectedRoom')];
	},
	rightCount: function(){
		return this.roomCount[Session.get('rightSelectedRoom')];
	},
	readyCount: function(){
		return this.roomCount['ready'];
	},
	transferDisabled: function(){
		if (!Session.get('rightSelectedRoom') || !Session.get('leftSelectedRoom'))
			return 'disabled';
	}

});