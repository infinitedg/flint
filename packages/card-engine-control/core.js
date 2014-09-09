Template.core_engineControl.events = {
	'change .engineController': function(e){
		var newSpeed = e.target.value;
		Flint.simulator('speed', newSpeed);
	},
	'click .heatRate': function(e){
		var value = prompt("What is the new heat rate? 1 is base.");
		Flint.simulator('heatRate', value);
	}
};

Template.core_engineControl.engineSpeed = function(){
	var speed = Flint.simulator('speed');
	var speedVal;
	if (speed.substr(0,1) === 0){
		if (speed.substr(2,1) === 0){speedVal = "Full Stop";}
		if (speed.substr(2,1) == 1){speedVal = "1/4 Impulse";}
		if (speed.substr(2,1) == 2){speedVal = "1/2 Impulse";}
		if (speed.substr(2,1) == 3){speedVal = "3/4 Impulse";}
		if (speed.substr(2,1) == 4){speedVal = "1 Impulse";}
		if (speed.substr(2,1) == 5){speedVal = "Destructive Impulse";}
	}
	if (speed.substr(0,1) == 1){
		if (speed.substr(2,1) === 0){speedVal = "Destructive Warp";}
		else {speedVal = "Warp " + speed.substr(2,1);}
	}
	return speedVal;
};
Template.core_heatLevels.heatRate = function(){
	return Flint.simulator('heatRate');
};
Template.core_heatLevels.heatLevel = function(heatType){
	var engineHeat = Flint.simulator('engineHeat');
	if (heatType == "warp" || heatType == "impulse"){return engineHeat[heatType] + "%";}
};
Template.core_heatLevels.rendered = function(){
	Draggable.create("div[data-type='impulse'] .heatDragger", {
		type:"x", 
		bounds:{top:0, left:-5, width:($("div[data-type='impulse']").width() + 8 + 5), height:$("div[data-type='impulse']").height()},
		onDragEnd: function(){
			TweenLite.to(this.target, 0.0, {
                transform: 'translate3d(0px,0px,0px)'
            });			
            var heatLevels = Flint.simulator('engineHeat');
			var delta = (this.x / this.target.parentElement.clientWidth)*100;
			heatLevels.impulse += delta;
			Flint.simulator('engineHeat',heatLevels);
		}
	});
	Draggable.create("div[data-type='warp'] .heatDragger", {
		type:"x", 
		//edgeResistance:0.65, 
		bounds:{top:0, left:-5, width:($("div[data-type='warp']").width() + 8 + 5), height:$("div[data-type='warp']").height()},
		onDragEnd: function(){
			TweenLite.to(this.target, 0.0, {
                transform: 'translate3d(0px,0px,0px)'
            });	
			var heatLevels = Flint.simulator('engineHeat');
			var delta = (this.x / this.target.parentElement.clientWidth)*100;
			heatLevels.warp += delta;
			Flint.simulator('engineHeat',heatLevels);
		}
	});
};