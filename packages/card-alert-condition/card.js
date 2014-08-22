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
Template.card_alertCondition.cardName = "Alert Condition";


/**
When you click one of the alertCondition buttons, change the alert condition to the `data-alert` attribute of the containing box
@method click .btn
*/
Template.card_alertCondition.events = {
  'click .alerts li': function(e) {
    Flint.beep();
    var a = $(e.target).data('alert');
    Flint.simulators.update(Flint.simulatorId(), {$set: {alertCondition: a}});
    e.preventDefault();
  },
  'mouseover .alerts li': function(e) {
    $('.alertInfo').text($(e.target).data().alertinfo);
  },
  'mouseleave .alerts li': function(e) {
    $('.alertInfo').text('');
  }
};

Template.card_alertCondition.alertLevel = function() {
 return Template.layout_default.alertLevel();   
}
