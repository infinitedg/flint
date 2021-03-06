Template.core_transporters.helpers({
	alert: function(){
		if (Flint.system('Transporters','state') == 'scanning'){
			return "alert";
		}
	},
	information: function(){
		return Flint.system('Transporters','state') + ": " + Flint.system('Transporters','target');
	},
	targetNum: function(){
		return Flint.system('Transporters','targets').length;
	}
});

Template.core_transporters.events({
	'click .transporterTargetNum' : function(e,t){
		var num = prompt("How many transporter targets?");
		var currentTargets = Flint.system('Transporters','targets');
		var currentCount = currentTargets.length;
		var newArray = [];
		var i;
		if (num < currentCount) {
			for (i = 0; i < num; i++){
				newArray[i] = currentTargets[i];
			}
		} else if (num > currentCount){
			newArray = currentTargets;
			for (i = 0; i < num - currentCount; i++){
				obj = {
					'targetId' : Meteor.uuid(),
					'top' : Math.random() * 90,
					'left' : Math.random() * 90
				};
				newArray.push(obj);
			}
		}
		Flint.system('Transporters','targets',newArray);
		if (num === 0) {
			Flint.system('Transporters','state','idle');
		}else {
			Flint.system('Transporters','state','targets');
		}
	}
});
