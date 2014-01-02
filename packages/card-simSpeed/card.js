/**
@module Templates
@submodule Cards
*/

/**
Station card for viewing and managing the current alert condition
@class card_alertCondition
*/

/**
The alert condtion for the simulator
@property alertCondition
@type Number
*/
Template.card_simSpeed.simSpeed = function() {
  var a = Flint.simulator().simSpeed;
  return a;
};

/**
The bootstrap styling for a given alert condition level
@property alertStyle
@type String
*/
Template.card_simSpeed.speedStyle = function() {
  var a = Flint.simulator().simSpeed;
  switch (a) {
  case 4:
    return '4';
  case 3:
    return '3';
  case 2:
    return '2';
  case 1:
    return '1';
  }
};

/**
When you click one of the simSpeed buttons, change the speed to the `data-alert` attribute of the containing box
@method click .btn
*/
Template.card_simSpeed.events = {
  'click .btn': function(e) {
    Flint.beep();
    var a = $(e.target).parents('[data-alert]').data('alert');
    Flint.simulators.update(Flint.simulatorId(), {$set: {simSpeed: a}});
    e.preventDefault();
  }
};
