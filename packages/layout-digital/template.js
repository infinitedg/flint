Template.digital_cardList.helpers({
	isCurrentCard: function() {
		return Flint.cardNumber() === this.cardId;
	},
	station: function() {
		return Flint.station();
	},
	cards: function() {
		var cards = Flint.station('cards');
		var x = _.map(cards, function(card, i) {
			return _.extend(card, {simulatorId: Flint.simulator()._id, stationId: Flint.station()._id, cardId: i });
		});

		return x;
	},
	currentCardImage: function(){
		if (Flint.card()){
			var cardId = Flint.card().cardId;
			return Flint.a('/Card Icons/' + cardId.slice(5,cardId.length));
		}
	},
	locked: function(){
		if (!Flint.client('name') || Flint.client('locked')){
			return 'locked';
		}
	}
})

Template.digital_cardList.events({
	'click .lockScreen':function(){
		Flint.client('locked',true);
	}
})
Template.layout_digital.helpers({
	retina: function(){
		var retina = "only screen and (-webkit-min-device-pixel-ratio: 2)," + "only screen and (min--moz-device-pixel-ratio: 2)," + "only screen and (-o-min-device-pixel-ratio: 2/1)," + "only screen and (min-device-pixel-ratio: 2)," + "only screen and (min-resolution: 192dpi)," + "only screen and (min-resolution: 2dppx)"
		if (window.matchMedia(retina).matches)
			return 'retina';
	},
	alertColor: function(){
		var alertNum = Flint.simulator('alertCondition');
		return 'alertColor' + alertNum;
	},
	alertnum:function(){
		if (Flint.simulator()){
			return Flint.simulator('alertCondition');
		}
	},
	loggedIn: function(){
		if (!Session.get('flint_clientName')){
			return 'loggedOut';
		}
	}
})

Template.digital_nameBox.helpers({
	username: function(){
		if (Flint.client()){
			return Flint.client().name;
		}
	},
	usernameStyle: function(){
		if (Flint.client()){
			if (Flint.client().name){
				if (Flint.client().name.length > 12){
					return "font-size:" + (20 - Flint.client().name.length/2) + "px;";
				}
			}
		}
	},
	stationName: function(){
		if (Flint.station()){
			return Flint.station().name;
		}
	},
	stationNameStyle: function(){

	},
	profilePictureSrc: function(){
		//This is a stub till we get actual user profiles in place.
		return "https://infinitedev-flint.s3.amazonaws.com/flintassets/xfNRX3Kb9Cp4pYi4t-flintassets-zckr6cCsbfzF5YFeH-flintassets-E2k4ewQA7RPJGhnGh-Vanguard.png";
	}
})
Router.onBeforeAction(function(){
	Flint.play('/Sounds/pagechange');
	this.next();
})
