Template.core_transporters.information = function(){

};
Template.core_transporters.targetNum = function(){
	return Flint.system('Transporters','targets').length;

};
Template.core_transporters.events = {
	'click .transporterTargetNum' : function(e,t){
		var num = prompt("How many transporter targets?");
		var currentTargets = Flint.system('Transporters','targets');
		var currentCount = currentTargets.length;
		var newArray = [];
		if (num < currentCount) {
			for (var i = 0; i < num; i++){
				newArray[i] = currentTargets[i];
			}
		} else if (num > currentCount){
			newArray = currentTargets;
			for (var i = 0; i < num - currentCount; i++){
				obj = {
					'targetId' : Meteor.uuid(),
					'top' : Math.random() * 90,
					'left' : Math.random() * 90
				}
				newArray.push(obj);
			}
		}
		Flint.system('Transporters','targets',newArray);
	}
}