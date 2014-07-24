Template.core_engineControl.events = {
	'change .engineController': function(e){
		var newSpeed = e.target.value;
		Flint.simulator('speed', newSpeed);
	}
};

Template.core_engineControl.engineSpeed = function(){
	var speed = Flint.simulator('speed');
	var speedVal;
	if (speed.substr(0,1) == 0){
		if (speed.substr(2,1) == 0){speedVal = "Full Stop";}
		if (speed.substr(2,1) == 1){speedVal = "1/4 Impulse";}
		if (speed.substr(2,1) == 2){speedVal = "1/2 Impulse";}
		if (speed.substr(2,1) == 3){speedVal = "3/4 Impulse";}
		if (speed.substr(2,1) == 4){speedVal = "1 Impulse";}
		if (speed.substr(2,1) == 5){speedVal = "Destructive Impulse";}
	}
	if (speed.substr(0,1) == 1){
		if (speed.substr(2,1) == 0){speedVal = "Destructive Warp";}
		else {speedVal = "Warp " + speed.substr(2,1);}
	}
	return speedVal;
};