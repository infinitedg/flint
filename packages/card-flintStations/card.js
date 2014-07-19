Template.card_flintstations.cardName = "Flint Stations";

Template.card_flintstations.created = function(){
	Session.set('selectedStation','');
	Session.set('selectedCard','');
	Session.set('selectedAllCard','');

	this.clientSub = Meteor.subscribe("core.flintstations.stations", Flint.simulatorId());
};

refactorCardOrder = function(addedCards){
	if (Session.get('selectedStation')){
		cardList = [];
		$('.cardList').children().each(function(e,t){
			cardList.push({"cardId": this.id, "name": this.innerText});
		});
		if (addedCards != undefined){
			cardList.push(addedCards);
			var stations = Session.get('selectedStation');
			stations.cards = cardList;
			Session.set('selectedStation', stations);
		}
		Flint.collection('stations').update(Session.get('selectedStation')._id, {$set: {'cards': cardList}});	

	}	
};
Template.card_flintstations.rendered = function(){
	var context = this;
	$(this.find('.cardList')).sortable({ // uses the 'sortable' interaction from jquery ui
    stop: function (event, ui) { // fired when an item is dropped
    	refactorCardOrder();
    }
  });
};
Template.card_flintstations.stations = function(){
	return Flint.collection('stations').find();
};
Template.card_flintstations.cards = function(){
  	var station = Session.get('selectedStation');
	var cards;
	if (station != undefined && station.hasOwnProperty('cards')){cards = station.cards;}
	return cards;
}
Template.card_flintstations.selectedStation = function(){
	return Session.get('selectedStation').name != undefined;
}
Template.card_flintstations.selectedCard = function(){
	if (Session.get('selectedStation').name != undefined){
		return Session.get('selectedCard').id != undefined;
	}
}
Template.card_flintstations.selectedAllCard = function(){
	if (Session.get('selectedStation').name != undefined){
		return Session.get('selectedAllCard').id != undefined;
	}	
}
Template.card_flintstations.allCards = function(){
	Templates = Template;
	var obj = [];
	for (var key in Templates) {
		if (key.substring(0,5) == "card_"){
			var cardname;
			if (Template[key].cardName != undefined){
				cardname = Template[key].cardName;
			} else {
				cardname = key.substring(5);
			}
			obj.push({'name': cardname, 'id': key});
   		}

   	}
   return (obj);
}
Template.card_flintstations.events = {
	'click .station': function(e,t){
		$(t.findAll('.stations .station')).removeClass('lineSelected');
		$(e.target).addClass('lineSelected');
		Session.set('selectedStation', this);
	},
	'click .cardList': function(e,t){
		$(t.findAll('.cardList .card')).removeClass('lineSelected');
		$(e.target).addClass('lineSelected');
		Session.set('selectedCard', {'name': e.target.innerText, 'id': e.target.id});
	},
	'click .allCards': function(e,t){
		$(t.findAll('.allCards .allCard')).removeClass('lineSelected');
		$(e.target).addClass('lineSelected');
		Session.set('selectedAllCard', {'name': e.target.innerText, 'id': e.target.id});
	},
	'click #addStation': function(e,t){
		var a = prompt("What is the station's name?");
		if (a){
			var obj = {
				name: a,
				cards: [{"name" : "Login", 	"cardId" : "card_login"}],
				simulatorId: Flint.simulatorId()				
			};
			console.log(obj)
			Flint.collection('stations').insert(obj);
		}
	},
	'click #renameStation': function(e,t){
		var a = prompt("What is the new name?");
		if (a){
			Flint.collection('stations').update(Session.get('selectedStation')._id,{$set: {'name': a}});
		}
	},
	'click #deleteStation': function(e,t){
		var a = prompt("Are you sure? Type 'Yes' to continue.");
		if (a == 'Yes'){
			Flint.collection('stations').remove(Session.get('selectedStation')._id);
		}
	},
	'click #addCard': function(e,t){
		var card = Session.get('selectedAllCard');
		refactorCardOrder({"cardId": card.id, "name": card.name});

	},
	'click #removeCard': function(e,t){
		var card = Session.get('selectedCard');
		var station = Session.get('selectedStation');
		var id = card.id;
		cardList = $.grep(station.cards, function(data, index) {
   			return data.cardId != id;
		});
		station.cards = cardList;
		Flint.collection('stations').update(Session.get('selectedStation')._id, {$set: {'cards': cardList}});	
		Session.set('selectedStation',station);
	}
};	


