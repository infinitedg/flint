(function () {
  'use strict';
  
  Template.themePicker.theme = function() {
    var station = Stations.findOne({_id: Session.get('station')});
    if (station) {
      var simulator = Simulators.findOne({_id: station.simulatorId});
      if (simulator.theme) {
        return simulator.theme;
      }
    } else {
      return false;
    }
  };
  
}());