Template.card_damageControl.helpers({
	shipDiagram: function(){
		return Flint.a('/Ship Views/Top');
	},
	damagedSystems: function(){
		return Flint.collection('systems').find({'simulatorId' : Flint.simulatorId(), 'damageStatus' : 'damaged'});
	},
	damageSteps: function(){
		var report = Flint.collection('damageReports').findOne(Session.get('damageControl.selectedSystem').currentDamageReport);
		return report.report.steps;
	}
});

Template.card_damageControl.created = function() {
  this.subscription = Tracker.autorun(function() {
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