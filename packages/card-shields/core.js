Template.core_shields.shieldLevel = function(){
	return  Flint.system('Shields','level') + "%";
};

Template.core_shields.raised = function(){
	return Flint.system('Shields','state');
};

Template.core_shields.rendered = function(){
	Draggable.create(".shieldDragger", {
		type:"x",
		bounds: {
			top:0,
			left:-4,
			width:($(".coreShields").width()*2 + 8),
			height:$(".shieldBox").height()
		},
		onDragEnd: function() {
			TweenLite.to(this.target, 0.0, {
				transform: 'translate3d(0px,0px,0px)'
			});
			var shieldLevel = Flint.system('Shields','level');
			var delta = (this.x / this.target.parentElement.clientWidth)*100;
			shieldLevel += delta;
			if (shieldLevel > 100) shieldLevel = 100;
			if (shieldLevel < 0) shieldLevel = 0;
			Flint.system('Shields','level',shieldLevel);
			if (Flint.system('Shields','state') == "raised"){
				Flint.tween('systems','systems-' + Flint.simulatorId() + '-shields',2,{'strength':shieldLevel, 'overwrite':'concurrent'});
			}
		}
	});
};

Template.core_shields.events = {
	'click .hitShields' : function(e,t){
		var shieldLevel = Flint.system('Shields','level');
		shieldLevel -= Math.random()*10;
		if (shieldLevel < 0) shieldLevel = 0;
		Flint.system('Shields','level',shieldLevel);
		Flint.tween('systems','systems-' + Flint.simulatorId() + '-shields',1,{'strength':shieldLevel, 'overwrite':'concurrent'});
	}
};
