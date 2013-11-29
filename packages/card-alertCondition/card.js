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
Template.card_alertCondition.alertCondition = function() {
  var a = Flint.simulator().alertCondition;
  return a;
};

/**
The bootstrap styling for a given alert condition level
@property alertStyle
@type String
*/
Template.card_alertCondition.alertStyle = function() {
  var a = Flint.simulator().alertCondition;
  switch (a) {
  case 4:
    return 'success';
  case 3:
    return 'info';
  case 2:
    return 'block';
  case 1:
    return 'error';
  }
};

/**
When you click one of the alertCondition buttons, change the alert condition to the `data-alert` attribute of the containing box
@method click .btn
*/
Template.card_alertCondition.events = {
  'click .btn': function(e) {
    Flint.beep();
    var a = $(e.target).parents('[data-alert]').data('alert');
    Flint.simulators.update(Flint.simulatorId(), {$set: {alertCondition: a}});
    e.preventDefault();
  }
};
