/**
@module Templates
@submodule Core
*/

/**
Core card for viewing and managing the current alert condition
@class core_alertCondition
*/

/**
The current alert condition. Also has a side-effect where it issues a notification when the alertCondition changes.
@property alertCondition
@type Number
*/
Template.core_alertCondition.alertCondition = function() {
  var a = Flint.simulator().alertCondition;
  Flint.notify('Alert condition ' + a); // @TODO: Trigger notifications only when the property changes, not when it is added/removed
  return a;
};

Template.core_alertCondition.events = {
  /**
  Present a modal to change the alert condition manually to a value between 1-4.
  @method click .condition
  */
  'click .condition': function(e) {
    Flint.beep();
    bootbox.prompt('Pick the alert condition (1-4)', 'Cancel', 'OK', function(result) {
      if (result !== undefined) {
        if (result < 1) {
          result = 1;
        } else if (result > 4) {
          result = 4;
        }
        
        Flint.simulators.update({ _id: Flint.simulatorId() },{$set: {alertCondition: result}});
      }
    }, Flint.simulator().alertCondition);
    e.preventDefault();
  }
};