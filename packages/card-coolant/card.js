Template.coolantTank.helpers({
	coolantHeight: function() {
		return Math.abs(Flint.simulator('coolant') - 100) * 0.56 + "%";
	}
});

Template.coolantTank.events({
	'mousedown .valve' : function(e,t){
		e.target.className.baseVal = "valve open";
		var id=e.target.id;
		var interval = Meteor.setInterval(function(){
			if (id == "warp" || id == "impulse"){
				var heatLevel = Flint.system('Engines','heat');
				heatLevel[id] -= 0.4;
				Flint.system('Engines','heat',heatLevel);
				Flint.simulator('coolant',(Flint.simulator('coolant') - 0.01));
			}
		},10)
		$(document).bind('mouseup',function(){
			e.target.className.baseVal = "valve";
			Meteor.clearInterval(interval);
			interval = null;
		})
		e.preventDefault();
	}
});