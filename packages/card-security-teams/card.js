var securityAssignment;

Template.card_security_teams.created = function(){
	Session.setDefault('security-currentView','securityTeamsView');
}

Template.card_security_teams.helpers({
	currentSecurityView:function(){
		return Session.get('security-currentView');
	}
})
Template.assignSecurity.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.crew', Flint.simulatorId());
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
	});
	Session.set('security-currentDeck',(Flint.simulatorId() + "-deck-1"));
	securityAssignment = new Mongo.Collection();
}
Template.assignSecurity.helpers({
	decks : function(){
		return Flint.collection('decks').find({},{sort:{'number': 1}});
	},
	rooms: function(){
		var currentDeck = Session.get('security-currentDeck');
		return Flint.collection('rooms').find({'deck':currentDeck});
	},
	officers:function(){
		var assigned = securityAssignment.find({},{fields:{_id:1}});
		var assignedArray = [];
		assigned.forEach(function(e){
			assignedArray.push(e._id);
		});
		return Flint.collection('crew').find({
			"position":{$in:["Security","Deputy Chief Of Security","Chief Of Security"]},
			'assignment':{$exists:false},
			'_id': {$nin: assignedArray}
		},{sort:{"lastName":1}});
	},
	assigned:function(){
		return securityAssignment.find({},{sort:{"lastName":1}});
	}
})
Template.assignSecurity.events({
	'click .securityOfficer':function(){
		securityAssignment.insert(this);
	},
	'click .securityAssigned':function(){
		securityAssignment.remove({_id:this._id});
	},
	'change .deckSelect': function(e,t){
		Session.set('security-currentDeck',e.target.value);
	},
	'click .sendSecurity':function(e,t){
		var submit = true;
		if (securityAssignment.find().count() == 0){
			submit = false;
			var assignedControl = t.find('.securityAssignedContainer .well');
			assignedControl.classList.add('invalid');
			Meteor.setTimeout(function(){
				assignedControl.classList.remove('invalid');
			},500);
		}
		if (t.find('.securityOrders').value == ''){
			submit = false;
			var ordersControl = t.find('.securityOrders');
			ordersControl.classList.add('invalid');
			Meteor.setTimeout(function(){
				ordersControl.classList.remove('invalid');
			},500);
		}
		if (submit){
			var obj = {
				'type':'security',
				'deck':t.find('.deckSelect').value,
				'orders':t.find('.securityOrders').value
			}
			if (t.find('.roomSelect').value != "Entire Deck")
				obj.room = t.find('.roomSelect').value;
			console.log(obj);
			securityAssignment.find().forEach(function(e){
				Flint.collection('crew').update({'_id':e._id},{$set:{assignment:obj}});
			});
			securityAssignment.remove({});
			t.find('.deckSelect').value = Flint.simulatorId() + "-deck-1";
			t.find('.roomSelect').value = "Entire Deck";
			t.find('.securityOrders').value = '';
			console.log(Flint.collection('crew').find({
				"position":{$in:["Security","Deputy Chief Of Security","Chief Of Security"]},
				'assignment':{$exists:true}}).fetch());
			Session.set('security-currentView','securityTeamsView');
		}
	}
})


Template.securityTeamsView.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.crew', Flint.simulatorId());
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
	});
}
Template.securityTeamsView.helpers({
	assignedSecurity: function(){
		var deckAssignment = [];
		var securityAssigned = Flint.collection('crew').find({
			"position":{$in:["Security","Deputy Chief Of Security","Chief Of Security"]},
			'assignment':{$exists:true}
			
		},{sort:{"lastName":1}});
		securityAssigned.forEach(function(e){
			if (e.assignment.deck == Session.get('security-currentDeck'))
				deckAssignment.push(e);
		})
		return deckAssignment;
	},
	securityLocation: function(){
		if (typeof Session.get('security-selectedOfficer') == 'object'){
			var deck = Flint.collection('decks').findOne({'_id':Session.get('security-selectedOfficer').assignment.deck});
			if ('room' in Session.get('security-selectedOfficer')){
				var room = Flint.collection('rooms').findOne({'_id':Session.get('security-selectedOfficer').assignment.room});
				return room.name + ", Deck" + deck.number;
			}
			else 
				return "Deck " + deck.number;
		}
	},
	securityOrders: function(){
		if (typeof Session.get('security-selectedOfficer') == 'object'){
			return Session.get('security-selectedOfficer').assignment.orders;
		}
	}
})
Template.securityTeamsView.events({
	'click .assignedSecurity':function(e,t){
		Session.set('security-selectedOfficer',this);
	},
	'click .recallOfficer':function(){
		var officer = Session.get('security-selectedOfficer');
		Flint.collection('crew').update({'_id':officer},{$set:{'recall':'true'}});
	},
	'click .assignOfficer':function(){
		Session.set('security-currentView','assignSecurity');
	}
})


Template.securityDeckSidebar.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.decks', Flint.simulatorId());
	});
	Session.set('security-currentDeck',(Flint.simulatorId() + "-deck-1"));
}
Template.securityDeckSidebar.helpers({
	decks : function(){
		return Flint.collection('decks').find({},{sort:{'number': 1}});
	},
	securityAssigned : function(){
		var crewAssignments = Flint.collection('crew').find({
			"position":{$in:["Security","Deputy Chief Of Security","Chief Of Security"]},
			'assignment':{$exists:true}
		},{fields:{'assignment':1}}).fetch();
		var assignedDecks = [];
		crewAssignments.forEach(function(e){
			assignedDecks.push(e.assignment.deck);
		})
		if (assignedDecks.indexOf(this._id) !=-1){
			return 'assigned';
		}
	}
})
Template.securityDeckSidebar.events({
	'click .deckSidebar p': function(e,t){
		Session.set('security-selectedOfficer',null);
		Session.set('security-currentDeck',this._id);
		Session.set('security-currentRoom',Flint.collection('rooms').find({'deck':this._id},{sort:{'name':1}}).fetch()[0]._id)
	}
})