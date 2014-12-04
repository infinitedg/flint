Template.card_scanner.helpers({
	scan_disabled: function() {
		if (Flint.system('Scanner','status') === 'scanning') {
			return 'disabled';
		} else {
			return '';
		}
	},
	scanning: function() {
		if (Flint.system('Scanner','status') === 'scanning') {
			return true;
		} else {
			return false;
		}
	},
	scannerResponse: function() {
		return Flint.system('Scanner','output');
	}
});

Template.card_scanner.events({
	'click .scan-btn': function(e, t) {
		var v = t.find('.input-field').value;
		Flint.system('Scanner','input', v);
		Flint.system('Scanner','status', 'scanning');
	},
	'click .scanning_output': function(e,t){
		e.preventDefault();
	}
});