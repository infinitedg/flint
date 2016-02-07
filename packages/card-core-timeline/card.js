Template.card_timelineEditor.onCreated(function() {
  this.subscribe('timelineEditor');
});

Template.card_timelineEditor.helpers({
  timelines: function() {
    return Flint.collection('flintTimelines').find();
  }
});

Template.card_timelineEditor.events({
  'change select': function(e, t) {
    var _id = e.currentTarget.options[e.currentTarget.selectedIndex].value;
    Session.set('card_timelineEditor.selected-id', _id);
  }
});
