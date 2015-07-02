var effectInterval;

Template.card_tractorBeam.rendered = function(){
	effectInterval = Meteor.setInterval(draw,64);
};

Template.card_tractorBeam.destroyed = function(){
	Meteor.clearTimeout(effectInterval);
	effectInterval = null;
};

Template.card_tractorBeam.helpers({
	tractorButton: function(){
		if (Flint.system('Tractor Beam','state') == 'idle')
			return "Activate Tractor Beam";
		else
			return "Deactivate Tractor Beam";
	},
	targetShown: function(){
		if (Flint.system('Tractor Beam','target') == 'false'){
			return 'not-shown';
		}
	},
	tractorButtonDisabled: function(){
		if (Flint.system('Tractor Beam','target') == 'false'){
			return 'disabled';
		}
	},
	tractorBeamActive: function(){
		if (Flint.system('Tractor Beam','state') == 'idle'){
			return 'not-shown';
		}
	},
	shipSide: function(){
		return Flint.a('/Ship Views/Side');
	}
});

Template.card_tractorBeam.events({
	'click .tractorIo': function(e,t){
		if (Flint.system('Tractor Beam','state') == 'idle')
			Flint.system('Tractor Beam','state','active');
		else
			Flint.system('Tractor Beam','state','idle');
	}
});

function draw(){
	var canvas = document.getElementById("tractorEffect");
	var context = canvas.getContext("2d");
	context.clearRect(0,0,400,200);
	for (i=0; i<200; i++){
		context.beginPath();
		context.moveTo(400, 0);
		context.lineTo(0, 140+(Math.random()*100));
		context.strokeStyle = "rgba(50,180,255,"+ (Math.random()-0.25) + ")";
		context.stroke();
	}
}
