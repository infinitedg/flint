Meteor.publish("timelineEditor", function() {
  return [
    Flint.collection('flintTimelines').find(),
    Flint.collection('flintTimelineCues').find(),
    Flint.collection('flintTimelineSteps').find()
  ];
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

Flint.registerMacro('sampleMacro',
  'Prints a message to the console', {
    'message': 'The message to print'
  },
  function(a) {
    if (a && a.message) {
      Flint.Log.info(a.message);
    } else {
      Flint.Log.error('No message parameter provided to sampleMacro');
    }
  }
);