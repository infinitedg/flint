Template.card_damage_systems.helpers({
	system:function(which){
		return Flint.systems.find();
	}

});

Template.card_damage_systems_tile.helpers({
	diagnosticState:function(){
		if (this.diagnostic === 'idle' || !this.diagnostic || this.diagnostic === 'progress'){
			return 'btn-primary';
		} else {
			return 'btn-warning';
		}
	},
	disabled:function(){
		if (this.diagnostic === 'progress' || this.diagnostic === 'orderSent'){
			return 'disabled';
		}
	},
	diagnosticLabel:function(){
		if (this.diagnostic === 'idle' || !this.diagnostic || this.diagnostic === 'progress'){
			return 'Run Diagnostic';
		}
		if (this.diagnostic === 'orderSent'){
			return 'Order Sent';
		}
		if (this.diagnostic === 'complete'){
			return 'Create Work Order';
		}
	},
	systemImage:function(){
		return 'https://infinitedev-flint.s3.amazonaws.com/flintassets/xfNRX3Kb9Cp4pYi4t-flintassets-zckr6cCsbfzF5YFeH-flintassets-E2k4ewQA7RPJGhnGh-Vanguard.png'
	}
});
