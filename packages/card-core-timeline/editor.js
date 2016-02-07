Template.card_timelineEditor.created = function() {
	this.timelineSub = Meteor.subscribe('timelineEditor', function() {
		var timeline = Flint.collection('flintTimelines').findOne() || {};
		Session.set('card_timelineEditor.selectedTimeline', timeline._id);
	});
};

Template.card_timelineEditor.destroyed = function() {
	this.timelineSub.stop();
};

Template.card_timelineEditor.helpers({
	timelines: function() {
		return Flint.collection('flintTimelines').find();
	},
	selectedTimeline: function() {
		return Flint.collection('flintTimelines').findOne(
			Session.get('card_timelineEditor.selectedTimeline')
			);
	}
});

Template.card_timelineEditor.events({
	'click button.create-timeline': function(e,t) {
		bootbox.prompt("What is the name of this timeline?", function(res){
			if (res) {
				var x = Flint.collection('flintTimelines').insert({name: res});
				Session.set('card_timelineEditor.selectedTimeline', x._id);
			}
		});
	},
	'change select': function(e, t) {
		var timeline = Flint.collection('flintTimelines').find().fetch()[e.target.selectedIndex];
		Session.set('card_timelineEditor.selectedTimeline', timeline._id);
	}
});
