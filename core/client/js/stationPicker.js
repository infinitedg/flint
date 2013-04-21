(function (){
  'use strict';
  
  Template.stationPicker.events({
    'click button.simulator': function(event) {
      Flint.beep();
      Session.set('selectedSimulatorId', this._id);
    },
    'click button.station': function(event) {
      Flint.setStationId(this._id);
    }
  });
  
  Template.stationPicker.simulators = function() {
    return Flint.simulators.find();
  };
  
  Template.stationPicker.stations = function() {
    var id = Session.get('selectedSimulatorId');
    return Flint.stations.find({simulatorId: id});
  };
  
  Template.stationPicker.selectedSimulator = function() {
    return Flint.simulators.find(Session.get('selectedSimulatorId'));
  };
}());