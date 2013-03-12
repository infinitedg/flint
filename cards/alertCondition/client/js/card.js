(function() {
	'use strict';
	
	Template.card_alertCondition.alertCondition = function() {
		var a = Flint.getSimulator().alertCondition;
		return a;
	};
	
	Template.card_alertCondition.alertStyle = function() {
		var a = Simulators.findOne(Flint.getSimulator()._id);
		switch (a) {
			case 4:
			return 'success';
			case 3:
			return 'info';
			case 2:
			return 'block';
			case 1:
			return 'error';
		}
	};
	
	Template.card_alertCondition.events = {
		'click .btn': function(e) {
			Flint.beep();
			var a = $(e.target).parents('[data-alert]').data('alert');
			Simulators.update({_id: Flint.getSimulator()._id}, {$set: {alertCondition: a}});
			e.preventDefault();
		}
	};
}());
	