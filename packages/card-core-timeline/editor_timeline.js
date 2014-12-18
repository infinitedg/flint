Template.timelineEditor_timeline.created = function() {
};

Template.timelineEditor_timeline.destroyed = function() {
	this.subs.stop();
};

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
		var circle = new Kinetic.Circle({
			radius: 10,
			fill: 'orange',
			stroke: 'black',
			strokeWidth: 2,
			x: e.evt.layerX,
			y: e.evt.layerY,
			draggable: true
		});

		layer.add(circle);
		circle.draw();
	});

};
