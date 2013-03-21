(function (){
  'use strict';
  Template.core_sensorGrid.events = {
    'click a.sensor-info': function(e, t) {
      e.preventDefault();
      var s = $(t.find('textarea.sensor-info')).val();
      console.log(s);
      Simulators.update({_id: Flint.getSimulator()._id}, {$set:{sensorText: s}});
    }
  };
  
  Template.core_sensorGrid.sensorText = function() {
    return Flint.getSimulator().sensorText;
  };
  
}());