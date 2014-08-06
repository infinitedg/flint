Template.card_engineControl.shipTopView = function(){
	return Flint.a('/Ship Views/Top');
};

Template.card_engineControl.events({
	'mouseup .speedBtn': function(e,t){
		Flint.beep();
		var data = e.target.dataset.speed;
		Flint.simulator('speed',data);
	}
});

Template.card_engineControl.currentSpeed = function(engine){
	var data = Flint.simulator('speed');
	var activeEngine = data.substr(0,1);
	var speed = data.substr(2,1);
	if (engine == 'impulse'){
		if (activeEngine == 0){ //Impulse Speed or Full Stop
			if (speed == 0){ //Full Stop
				return "width: 0%;";
			} else {
				return "width: " + (speed * 20) + "%;";
			}
		} else { return "width: 100%;";}
	}
	if (engine == 'warp'){
		if (activeEngine == 0){ //Impulse Speed or Full Stop
			return "width: 0%;";
		} else { 
			if (speed == 0){speed = 10;}
			return "width: " + (speed * 10) + "%;";
		}
	}
};

Template.card_engineControl.heatLevel = function(engine){
	var heat = Flint.simulator('engineHeat')[engine];
	return "height: " + heat + "%;";
}