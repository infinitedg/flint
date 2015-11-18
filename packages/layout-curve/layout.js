Template.layout_curve.helpers({
	alertClass:function(){
		var alertNum = Flint.simulator('alertCondition');
		return 'alertColor' + alertNum;
	},
	alertnum:function(){
		if (Flint.simulator()){
			return Flint.simulator('alertCondition');
		}
	},
	simulator:function(){
		return Flint.simulator();
	},
	station:function(){
		return Flint.station();
	},
	username:function(){
		if (Flint.client()){
			return Flint.client().name;
		}
	},
	usernameStyle:function(){
		if (Flint.client()){
			if (Flint.client().name){
				if (Flint.client().name.length > 12){
					return 'font-size:' + (40 - Flint.client().name.length / 2) + 'px;';
				}
			}
		}
	},
	simulatorSrc: function(){
		//This is a stub till we get actual user profiles in place.
		return "https://infinitedev-flint.s3.amazonaws.com/flintassets/xfNRX3Kb9Cp4pYi4t-flintassets-zckr6cCsbfzF5YFeH-flintassets-E2k4ewQA7RPJGhnGh-Vanguard.png";
	}
});
Template.layout_curve_cardButton_instance.helpers({
	isCurrentCard:function() {
		return Flint.cardNumber() === this.cardId;
	},
});

Template.layout_curve_cardButtons.helpers({
	cards:function() {
		var cards = Flint.station('cards');
		var x = _.map(cards, function(card, i) {
			return _.extend(card, {simulatorId:Flint.simulator()._id, stationId:Flint.station()._id, cardId:i });
		});
		return x;
	},
});
