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
  this.subscribe('flint_macro_engine.macroNames');

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
   * Changes the checked state of the checkbox to show if it's in edit mode
   * @return {string} 'checked'
   */
   inEditMode:function(){
    if (Session.get('card_timelineEditor.editMode')) return 'checked';
  },
   /**
   * Lists the available macros
   * @return {array} of macro documents
   */
   'availableMacros':function(){
    return Flint.collection('flintMacroDefinitions').find();
  },
  'configTemplate':function(){
    var macro = Session.get('flint-macros-currentMacro');
    if (macro != undefined){
      return 'macro_' + macro.macroName;
    } else {
      return null;
    }
  },
  'configArguments':function(){
    var macro = Session.get('flint-macros-currentMacro');
    if (macro != undefined){
      return macro.arguments;
    } else {
      return null;
    }
  },
  /**
   * List of all timeline objects
   * @return {array} All timeline objects
   */
   timelines: function() {
    return Flint.collection('flintTimelines').find();
  },
  /**
   * List of all cues in the timeline.
   * @return {array} All cues within the timeline
   */
   cues: function(){
    return Flint.collection('flintTimelineCues').find({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id')
    })
  },
  /**
   * The currently selected cue
   * @return {object} The currently selected cue
   */
   cue: function() {
    return Flint.collection('flintTimelineCues').findOne({
      timelineId: Session.get('card_timelineEditor.selected-timeline-id'),
      _id: Session.get('card_timelineEditor.selected-cue-id')
    });
  },
  /**
   * List of steps (macros) in the currently selected cue/timeline
   * @return {array} Array of step objects in this cue/timeline
   */
   steps: function() {
    return Flint.collection('flintMacroPresets').find({
      cueId: Session.get('card_timelineEditor.selected-cue-id')
    }, {
      sort: {
        order: 1
      }
    });
  },
  /***
   * Shows which cue is currently selected
   * @return {string} '' or 'selectedCue'
   */
   selectedCueClass: function(){
    if (this._id === Session.get('card_timelineEditor.selected-cue-id')) return 'selectedCue';
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
  var steps = Flint.collection('flintMacroPresets').find({
    cueId: Session.get('card_timelineEditor.selected-cue-id'),
    enabled: true
  }).forEach(function(step) {
    step.arguments.simulatorId = Flint.simulatorId();
    Flint.macro(step.macroName, step.arguments);
  });
}

/**
 * Schedule all macros from the current cue (including disabled)
 * @return {[type]} [description]
 */
 function runAll() {
  var steps = Flint.collection('flintMacroPresets').find({
    cueId: Session.get('card_timelineEditor.selected-cue-id')
  }).forEach(function(step) {
    step.arguments.simulatorId = Flint.simulatorId();
    Flint.macro(step.macroName, step.arguments);
  });
}


Template.card_timelineEditor.events({
  /**
   * Sets Edit Mode
   */
   'click #editMode':function(e){
    Session.set('card_timelineEditor.editMode',e.target.checked);
  },
  'change .addMacro':function(e){
    if (Session.get('card_timelineEditor.selected-cue-id')){
      var label = prompt('What is the label for this step?');
      var order = Flint.collection('flintMacroPresets').find({
        cueId: Session.get('card_timelineEditor.selected-cue-id')
      }).count() + 1;
      var step = {
        arguments:{},
        macroName:e.target.value,
        label: label,
        cueId: Session.get('card_timelineEditor.selected-cue-id'),
        order: order
      }
      Flint.collection('flintMacroPresets').insert(step,function(err,_id){
        Session.set('flint-macros-currentMacro',Flint.collection('flintMacroPresets').findOne({_id:_id}));
        $('.addMacroLabel').removeAttr('selected');
        $('.addMacroLabel').attr('selected','true');
      })
    }
  },
  'click .stepList':function(){
    Session.set('flint-macros-currentMacro',this);
  },
  /**
   * Watch for macro enabled changes
   * @param  {event} e Event object
   */
   'change input[type=checkbox]': function(e) {
    Flint.collection('flintMacroPresets').update(this._id, {$set: {enabled: e.target.checked }});
  },
  /**
   * Set the currently selected timeline
   * @param  {event} e Event object
   */
   'change select#timelines': function(e) {
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
   * Select a specific cue from the timeline
   */
   'click li.cueList':function(){
    Session.set('card_timelineEditor.selected-cue-id', this._id);
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
