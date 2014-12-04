Template.card_shields.events({

});

Template.card_shields.helpers({
	topView: function(){
		return Flint.a('/Ship Views/Top');
	},
	shieldStyle: function(){
		var colorvar;
		var shieldLevel = Flint.system('Shields','strength');
		if (shieldLevel > 33){
			colorvar = "hsl(" + ((shieldLevel-32) * 3.25) + ",100%,50%)";
		} else {
			colorvar = "hsl(0,100%," + (shieldLevel/0.3/2) + "%)";
		}
		return "-webkit-filter: drop-shadow(0px 0px 15px " + colorvar + ");";
	},
	shieldState: function(){
		if (Flint.system('Shields','state') == "raised"){
			return "Lower Shields";
		} else {
			return "Raise Shields";
		}
	},
	shieldLevel: function(){
		return Math.round(Flint.system('Shields','strength')) + "%";
	},
	shieldStrengthStyle: function(){
		var strength = Flint.system('Shields','strength');
		return "transform: translateX(-" + Math.abs(strength - 100) + "%);";
	}
});

Template.card_shields.rendered = function(){
	var shieldObserver = Flint.collection('systems').find({'name':'Shields'}).observeChanges({
		changed: function(fields,id){
			if (fields.state){
				if (fields.state == "raised"){
				}
			}
			if (fields.strength){

			}
		}
	})
}
Template.card_shields.events({
	'click .shieldChange': function(){
		if (Flint.system('Shields','state') == "raised"){
			Flint.system('Shields','state','lowered');
			Flint.tween('systems','systems-' + Flint.simulatorId() + '-shields',5,{'strength':0, 'overwrite':'concurrent'});
		} else {
			Flint.system('Shields','state','raised');
			Flint.tween('systems','systems-' + Flint.simulatorId() + '-shields',5,{'strength': Flint.system('Shields','level'), 'overwrite':'concurrent'});
		}
	}
});