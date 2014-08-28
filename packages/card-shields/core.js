Template.core_shields.shieldLevel = function(){
	return  Flint.system('Shields','level') + "%";
};
Template.core_shields.raised = function(){
	return Flint.system('Shields','state');
}
Template.core_shields.rendered = function(){
	Draggable.create(".shieldDragger", {
		type:"x", 
		bounds:{
			top:0, 
			left:-5, 
			width:($(".shieldBox").width() + 8 + 5), 
			height:$(".shieldBox").height()},
		onDragEnd: function(){
			TweenLite.to(this.target, 0.0, {
                transform: 'translate3d(0px,0px,0px)'
            });			
            var shieldLevel = Flint.system('Shields','level');
			var delta = (this.x / this.target.parentElement.clientWidth)*100;
			shieldLevel += delta;
			Flint.system('Shields','level',shieldLevel);
			if (Flint.system('Shields','state') == "raised"){
				Flint.tween('systems','systems-odyssey-shields',2,{'strength':shieldLevel, 'overwrite':'concurrent'});
			}
		}
	});
};

