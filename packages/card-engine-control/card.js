Template.card_engineControl.helpers({
	shipTopView: function(){
		return Flint.a('/Ship Views/Top');
	},
	currentSpeed: function(engine){
		var data = Flint.system('Engines','speed');
		var activeEngine = data.substr(0,1);
		var speed = data.substr(2,1);
		if (engine == 'impulse'){
			if (activeEngine === 0){ //Impulse Speed or Full Stop
				if (speed === 0){ //Full Stop
					return "width: 0%;";
				} else {
					return "width: " + (speed * 20) + "%;";
				}
			} else { return "width: 100%;";}
		}
		if (engine == 'warp'){
			if (activeEngine === 0){ //Impulse Speed or Full Stop
				return "width: 0%;";
			} else { 
				if (speed === 0){speed = 10;}
				return "width: " + (speed * 10) + "%;";
			}
		}
	},

	heatLevel: function(engine){
		var heat = Flint.system('Engines','heat')[engine];
		return "height: " + heat + "%;";
	}
});

Template.card_engineControl.events({
	'mouseup .speedBtn': function(e,t){
		Flint.beep();
		var data = e.target.dataset.speed;
		Flint.system('Engines','speed',data);
	}
});
