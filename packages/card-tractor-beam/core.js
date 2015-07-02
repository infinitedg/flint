Template.core_tractorBeam.helpers({
	hasTarget: function(){
		if (Flint.system('Tractor Beam','target') == 'true') {
			return 'Yes';
		} else {
			return 'No';
		}
	},
	tractorActive: function(){
		return capitalizeFirstLetter(Flint.system('Tractor Beam','state'));
	}
});

Template.core_tractorBeam.events({
	'click .tractorTargetBtn':function(){
		if (Flint.system('Tractor Beam','target') == 'true'){
			Flint.system('Tractor Beam','target','false');
			Flint.system('Tractor Beam','state','idle');
		} else {
			Flint.system('Tractor Beam','target','true');
		}
	}
});

function capitalizeFirstLetter(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}
