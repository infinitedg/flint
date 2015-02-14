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
	}
})

Template.layout_digital.helpers({
	retina: function(){
		var retina = "only screen and (-webkit-min-device-pixel-ratio: 2)," + "only screen and (min--moz-device-pixel-ratio: 2)," + "only screen and (-o-min-device-pixel-ratio: 2/1)," + "only screen and (min-device-pixel-ratio: 2)," + "only screen and (min-resolution: 192dpi)," + "only screen and (min-resolution: 2dppx)"
		if (window.matchMedia(retina).matches)
			return 'retina';
	}
})