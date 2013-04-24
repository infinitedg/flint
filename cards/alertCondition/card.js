(function() {
  'use strict';
  
  Template.card_alertCondition.alertCondition = function() {
    var a = Flint.simulator().alertCondition;
    return a;
  };
  
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
  
  Template.card_alertCondition.events = {
    'click .btn': function(e) {
      Flint.beep();
      var a = $(e.target).parents('[data-alert]').data('alert');
      Flint.simulators.update(Flint.simulatorId(), {$set: {alertCondition: a}});
      e.preventDefault();
    }
  };
}());
  