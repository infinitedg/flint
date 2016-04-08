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

  var timeline = Flint.collection('flintTimelines').findOne();
  if (timeline) {
    Session.set('card_timelineEditor.selected-timeline-id', timeline._id);
    var firstCue = Flint.collection('flintTimelineCues').findOne({
      timelineId: timeline._id
    }, {
      sort: {
        order: 1
      }
    });
    Session.set('card_timelineEditor.selected-cue-id', firstCue._id);
  }
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
      cueId: Session.get('card_timelineEditor.selected-cue-id')
    }, {
      sort: {
        order: 1
      }
    });
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
    if (minCue === Infinity ||
      (cue && minCue && cue.order <= minCue.order)) {
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
    if (maxCue === -Infinity ||
      (cue && maxCue && cue.order >= maxCue.order)) {
      return 'disabled';
    }
  }
});

/**
 * Block of helper functions to simplify event map
 */

/**
 * Find the next cue and set it as active
 */
function nextCue() {
  var currentCue = Flint.collection('flintTimelineCues').findOne(Session.get('card_timelineEditor.selected-cue-id'));
  var nextCue = Flint.collection('flintTimelineCues').findOne({
    timelineId: currentCue.timelineId,
    order: {
      $gt: currentCue.order
    }
  }, {
    sort: {
      order: 1
    }
  });
  if (nextCue !== undefined) {
    Session.set('card_timelineEditor.selected-cue-id', nextCue._id);
  }
}

/**
 * Find the previous cue and set it as active
 */
function prevCue() {
  var currentCue = Flint.collection('flintTimelineCues').findOne(Session.get('card_timelineEditor.selected-cue-id'));
  var prevCue = Flint.collection('flintTimelineCues').findOne({
    timelineId: currentCue.timelineId,
    order: {
      $lt: currentCue.order
    }
  }, {
    sort: {
      order: -1
    }
  });
  if (prevCue !== undefined) {
    Session.set('card_timelineEditor.selected-cue-id', prevCue._id);
  }
}

/**
 * Schedule all enabled macros from the current cue
 */
function runCue() {
  var steps = Flint.collection('flintTimelineSteps').find({
    cueId: Session.get('card_timelineEditor.selected-cue-id'),
    enabled: true
  }).forEach(function(step) {
    Flint.macro(step.macroName, step.arguments);
  });
}

/**
 * Schedule all macros from the current cue (including disabled)
 * @return {[type]} [description]
 */
function runAll() {
  var steps = Flint.collection('flintTimelineSteps').find({
    cueId: Session.get('card_timelineEditor.selected-cue-id')
  }).forEach(function(step) {
    Flint.macro(step.macroName, step.arguments);
  });
}


Template.card_timelineEditor.events({
  /**
   * Watch for macro enabled changes
   * @param  {event} e Event object
   */
  'change input[type=checkbox]': function(e) {
    Flint.collection('flintTimelineSteps').update(this._id, {$set: {enabled: e.target.checked }});
  },
  /**
   * Set the currently selected timeline
   * @param  {event} e Event object
   */
  'change select': function(e) {
    var _id = e.currentTarget.options[e.currentTarget.selectedIndex].value;
    Session.set('card_timelineEditor.selected-timeline-id', _id);
    var firstCue = Flint.collection('flintTimelineCues').findOne({
      timelineId: _id
    }, {
      sort: {
        order: 1
      }
    });
    // When no cue available, use undefined
    if (firstCue) {
      Session.set('card_timelineEditor.selected-cue-id', firstCue._id);
    } else {
      Session.set('card_timelineEditor.selected-cue-id', undefined);
    }
  },
  /**
   * Schedule all enabled macros in the currently selected cue and
   * go to next cue
   * @param  {event} e Event object
   */
  'click button.runCueNext': function(e, t) {
    e.preventDefault();
    runCue();
    nextCue();
  },
  /**
   * Schedule all enabled macros in the currently selected cue and
   * stay on this cue
   * @param  {event} e Event object
   */
  'click a.runCueStay': function(e, t) {
    e.preventDefault();
    runCue();
  },
  /**
   * Schedule all macros in the currently selected cue and
   * go to next cue
   * @param  {event} e Event object
   */
  'click a.runAllNext': function(e, t) {
    e.preventDefault();
    runAll();
    nextCue();
  },
  /**
   * Schedule all macros in the currently selected cue and
   * stay on this cue
   * @param  {event} e Event object
   */
  'click a.runAllStay': function(e, t) {
    e.preventDefault();
    runAll();
  },
  /**
   * Go back one cue in this timeline
   * @param  {event} e Event object
   */
  'click button.prevCue': function(e, t) {
    e.preventDefault();
    prevCue();
  },
  /**
   * Go forward one cue in this timeline
   * @param  {event} e Event object
   */
  'click button.nextCue': function(e) {
    e.preventDefault();
    nextCue();
  }
});
