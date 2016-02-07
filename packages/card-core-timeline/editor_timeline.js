Template.timelineEditor_timeline.created = function() {
};

Template.timelineEditor_timeline.destroyed = function() {
	this.subs.stop();
};

Template.timelineEditor_timeline.events({
	'click button.connect-mode': function(e, t) {
		var x = Session.get('timelineEditor_timeline.connect-mode') || false;
		Session.set('timelineEditor_timeline.connect-mode', !x);
	},
	'click button.rename-timeline': function(e, t) {
		e.preventDefault();
		bootbox.prompt("What is the new name of this timeline?", function(res){
			if (res) {
				var x = Flint.collection('flintTimelines')
				.update(Session.get('card_timelineEditor.selectedTimeline'), {$set: {name: res}});
			}
		});
	}
});

Template.timelineEditor_timeline.helpers({
	connectModeCSS: function() {
		if (Session.get('timelineEditor_timeline.connect-mode')) {
			return 'active';
		}
	}
});

Template.timelineEditor_timeline.rendered = function() {
	var self = this;

	this.subs = Meteor.subscribe('timelineEditor_timeline', this.data._id);

	var stage = new Kinetic.Stage({
        container: this.find('.timelineEditor'),
        width: 300,
        height: 300,
        fill: 'orange'
      });

	var layer = new Kinetic.Layer();
	stage.add(layer);

	stage.on('contentClick', function(e) {
		if (Session.get('timelineEditor_timeline.connect-mode')) {

		} else {
			Flint.collection('flintCues').insert({
				x: e.evt.layerX,
				y: e.evt.layerY,
				timelineId: self.data._id
			});
		}
	});

	this.nodeInstances = {};

	this.tracker = Tracker.autorun(function() {
		Flint.collection('flintCues').find({}).observe({
			added: function(doc) {
				var circle = new Kinetic.Circle({
					radius: 10,
					fill: 'orange',
					stroke: 'black',
					strokeWidth: 2,
					x: doc.x,
					y: doc.y
				});

				circle.on('click', function() {

				});

				layer.add(circle);
				circle.draw();

				self.nodeInstances[doc._id] = circle;
			},
			changed: function(doc, oldDoc) {

			},
			removed: function(doc) {
				self.nodeInstances[doc._id].destroy();
				stage.draw();
			}
		});
	});
};
