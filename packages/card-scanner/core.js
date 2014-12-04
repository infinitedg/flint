Template.core_scanner.helpers({
	scannerInput: function() {
		return Flint.system('Scanner','input');
	}
});

Template.core_scanner.events({
	'click button': function(e, t) {
		e.preventDefault();
		var v = t.find('.response').value;
		Flint.system('Scanner','output', v);
		Flint.system('Scanner','status', 'idle');
	}
});