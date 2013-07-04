Template.core_alertCondition.alertCondition = function() {
  var a = Flint.simulator().alertCondition;
  Flint.notify('Alert condition ' + a);
  return a;
};

Template.core_alertCondition.events = {
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