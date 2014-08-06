Template.card_scanner.scan_disabled = function() {
	if (Flint.simulator('scannerStatus') === 'scanning') {
		return 'disabled';
	} else {
		return '';
	}
};

Template.card_scanner.scanning = function() {
	if (Flint.simulator('scannerStatus') === 'scanning') {
		return true;
	} else {
		return false;
	}
};

Template.card_scanner.scannerResponse = function() {
	return Flint.simulator('scannerResponse');
};

Template.card_scanner.events({
	'click .scan-btn': function(e, t) {
		var v = t.find('.input-field').value;
		Flint.simulator('scannerInput', v);
		Flint.simulator('scannerStatus', 'scanning');
	},
	'click .scanning_output': function(e,t){
		e.preventDefault();
	}
});