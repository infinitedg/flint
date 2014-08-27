Template.card_damageControl.shipDiagram = function(){
	return Flint.a('/Ship Views/Top');
};

Template.card_damageControl.damagedSystems = function(){
	return Flint.collection('systems').find({'simulatorId' : Flint.simulatorId(), 'damageStatus' : 'damaged'});
};
Template.card_damageControl.damageSteps = function(){
	var report = Flint.collection('damageReports').findOne(Session.get('damageControl.selectedSystem').currentDamageReport);
	return report.report.steps;
};
Template.card_damageControl.created = function() {

  this.subscription = Deps.autorun(function() {
    Meteor.subscribe('cards.card-damageReports.damageReports', Flint.simulatorId());
  });
};
Template.card_damageControl.events = {
	'click .damagedSystem' : function(e,context){
		Flint.beep();
		Session.set('damageControl.selectedSystem',this);
	},
	'click .damageStep' : function(e,context){
		$('.damageStep').removeClass('selectedStep');
		Meteor.setTimeout(function(){
			$(e.target.parentElement).addClass('selectedStep');
		},10);
	}
};