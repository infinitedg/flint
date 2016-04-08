/**
 * The timeline is built of three entities:
 * 		- Timeline: A collection of cues
 * 		- Cue: A collection of steps, in order on a timeline
 * 		- Step: A macro definition, in order in a cue, that can be disabled or enabled
 */

/**
 * Subscriptions for this template
 */
Template.card_timelineEditor.onCreated(function() {
  this.subscribe('timelineEditor');
});


Template.card_timelineEditor.helpers({
  /**
   * List of all timeline objects
   * @return {array} All timeline objects
   */
  timelines: function() {
    return Flint.collection('flintTimelines').find();
  },
  /**
   * The currently selected cue
   * @return {object} The currently selected cue
   */
  cue: function() {
    return Flint.collection('flintTimelineCues').find({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id'),
      cueId: Session.get('card_timelineEditor.selected-cue-id')
    });
  },
  /**
   * List of steps (macros) in the currently selected cue/timeline
   * @return {array} Array of step objects in this cue/timeline
   */
  steps: function() {
    return Flint.collection('flintTimelineSteps').find({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id'),
      cueId: Session.get('card_timelineEditor.selected-cue-id')
    }, {sort: {order: 1}});
  },
  /**
   * Disable or enable the "run cue" button
   * @return {string} '' or 'disabled'
   */
  runCueClass: function() {
    if (Flint.collection('flintTimelineCues').find({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id')
    }).count() > 0) {
      return '';
    } else {
      return 'disabled';
    }
  },
  /**
   * Determine whether the previous cue button should be disabled
   * @return {string} '' or 'disabled'
   */
  prevCueClass: function() {
    var cue = Flint.collection('flintTimelineCues').findOne(
      Session.get('card_timelineEditor.selected-cue-id')
    );
    var minCue = _.min(Flint.collection('flintTimelineCues').find({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id')
    }).fetch(), function(el) {
      return el.order;
    });
    if (cue && minCue && cue.order <= minCue.order) {
      return 'disabled';
    }
  },
  /**
   * Determine whether the next cue button should be disabled
   * @return {string} '' or 'disabled'
   */
  nextCueClass: function() {
    var cue = Flint.collection('flintTimelineCues').findOne(
      Session.get('card_timelineEditor.selected-cue-id')
    );
    var maxCue = _.max(Flint.collection('flintTimelineCues').find({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id')
    }).fetch(), function(el) {
      return el.order;
    });
    if (cue && maxCue && cue.order >= maxCue.order) {
      return 'disabled';
    }
  }
});

Template.card_timelineEditor.events({
  /**
   * Set the currently selected timeline
   * @param  {event} e Event object
   */
  'change select': function(e) {
    var _id = e.currentTarget.options[e.currentTarget.selectedIndex].value;
    Session.set('card_timelineEditor.selected-timeline-id', _id);
    Session.set('card_timelineEditor.selected-cue-id', 0);
  },
  /**
   * Create a new timeline
   * @param  {event} e Event object
   */
  'click button.add-timeline': function(e, t) {
    e.preventDefault();
    bootbox.prompt("What is the name of this timeline?", function(res) {
      if (res) {
        Flint.collection('flintTimelines').insert({name: res});
      }
    });
  },
  /**
   * Schedule all enabled macros in the currently selected cue and
   * go to next cue
   * @param  {event} e Event object
   */
  'click button.runCueNext': function(e, t) {
    e.preventDefault();

  },
  /**
   * Schedule all enabled macros in the currently selected cue and
   * stay on this cue
   * @param  {event} e Event object
   */
  'click button.runCueStay': function(e, t) {
    e.preventDefault();

  },
  /**
   * Schedule all macros in the currently selected cue and
   * go to next cue
   * @param  {event} e Event object
   */
  'click button.runAllNext': function(e, t) {
    e.preventDefault();

  },
  /**
   * Schedule all macros in the currently selected cue and
   * stay on this cue
   * @param  {event} e Event object
   */
  'click button.runAllStay': function(e, t) {
    e.preventDefault();

  },
  /**
   * Go back one cue in this timeline
   * @param  {event} e Event object
   */
  'click button.prevCue': function(e, t) {

  },
  /**
   * Go forward one cue in this timeline
   * @param  {event} e Event object
   */
  'click button.nextCue': function(e, t) {

  }
});
