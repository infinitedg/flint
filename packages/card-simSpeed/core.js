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
Template.core_simSpeed.simSpeed = function() {
  var a = Flint.simulator().simSpeed;
  Flint.notify('The Current Ship Speed is ' + a); // @TODO: Trigger notifications only when the property changes, not when it is added/removed
  return a;
};

Template.core_simSpeed.events = {
  /**
  Present a modal to change the simulator speed manually to a value between 1-4.
  @method click .condition
  */
  'click .condition': function(e) {
    Flint.beep();
    bootbox.prompt('Pick the ship's speed (1-4)', 'Cancel', 'OK', function(result) {
      if (result !== undefined) {
        if (result < 1) {
          result = 1;
        } else if (result > 4) {
          result = 4;
        }
        
        Flint.simulators.update({ _id: Flint.simulatorId() },{$set: {simSpeed: result}});
      }
    }, Flint.simulator().simSpeed);
    e.preventDefault();
  }
};
Status API Training Shop Blog About © 2013 GitHub, Inc. Terms Privacy Security Contact 
