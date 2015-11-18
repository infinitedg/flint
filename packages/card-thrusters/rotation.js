Template.thruster_rotation.helpers({
	thrusterType:function(){
		// This simplifies accessing the dial data.
		return ['yaw', 'pitch', 'roll'];
	},
	rotationValue:function() {
		return Flint.system('Thrusters', 'current')[this];
	},
	requiredValue:function() {
		return Flint.system('Thrusters', 'required')[this];
	}
});

Template.thruster_rotation.rendered = function(){
	var self = this;
	Draggable.create('.dial', {
		type:'rotation',
		onDrag:function(){
			var thrusterObj = Flint.system('Thrusters', 'current');
			var thrusterValue = Math.round((this.rotation % 360 ));
			if (thrusterValue < 0){
				thrusterValue = Math.abs(thrusterValue + 360);
			}
			thrusterObj[this.target.parentElement.dataset.type] = thrusterValue;
			Flint.system('Thrusters', 'current', thrusterObj);
		}
	});
	this.thrusterObserver = Flint.systems.find({name:'Thrusters'}).observe({
		added:function(doc){
			var currentThrusters = doc.current;
			TweenLite.to($('[data-type="yaw"]').children(), 0, {rotation:currentThrusters.yaw});
			TweenLite.to($('[data-type="pitch"]').children(), 0, {rotation:currentThrusters.pitch});
			TweenLite.to($('[data-type="roll"]').children(), 0, {rotation:currentThrusters.roll});
		},
		changed:function(doc){
			var currentThrusters = doc.current;
			TweenLite.to($('[data-type="yaw"]').children(), 0, {rotation:currentThrusters.yaw});
			TweenLite.to($('[data-type="pitch"]').children(), 0, {rotation:currentThrusters.pitch});
			TweenLite.to($('[data-type="roll"]').children(), 0, {rotation:currentThrusters.roll});
		}
	});
};

Template.thruster_rotation.destroyed = function(){
	this.thrusterObserver.stop();
};

