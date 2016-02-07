Meteor.publish("timelineEditor", function() {
  return Flint.collection('flintTimelines').find();
});

Meteor.publish('timelineEditor_timeline', function(timelineId) {
  return [
    Flint.collection('flintCues').find({
      timelineId: timelineId
    }),
    Flint.collection('flintCuePaths').find({
      timelineId: timelineId
    })
  ];
});