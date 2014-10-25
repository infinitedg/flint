Template.core_scanner.helpers({
	scannerInput: function() {
		return Flint.simulator('scannerInput');
	}
});

Template.core_scanner.events({
	'click button': function(e, t) {
		e.preventDefault();
		var v = t.find('.response').value;
		Flint.simulator('scannerResponse', v);
		Flint.simulator('scannerStatus', 'idle');
	}
});