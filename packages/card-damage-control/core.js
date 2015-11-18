Template.core_damageControl.helpers({
	systems: function(){
		return Flint.system();
	},
	isDamaged: function(){
		if (this.damageStatus == "damaged"){
			return "damaged";
		}
		else {
			return false;
		}
	}
});

Template.core_damageControl.events = {
	'click .system' : function(e){
		if (Flint.system(this.name,'damageStatus') == "damaged"){
			Flint.system(this.name,'damageStatus','working');
			Flint.system(this.name,'currentDamageReport'," ");
		} else {
			Flint.system(this.name,'damageStatus','damaged');
		}
		e.preventDefault();
	}
};

Template.core_damageControl.created = function() {

  this.subscription = Tracker.autorun(function() {
    Meteor.subscribe('cards.card-damageReports.damageReports', Flint.simulatorId());
  });
};