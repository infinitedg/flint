(function (){
  'use strict';
  
  Template.stationPicker.events({
    'click button.simulator': function(event) {
      Flint.beep();
      Session.set('selectedSimulator', this);
    },
    'click button.station': function(event) {
      Session.set('selectedStation', this);
      Cookie.set('station', this._id);
      Session.set('station', this._id);
    }
  });
  
  Template.stationPicker.simulators = function() {
    return Simulators.find({});
  };
  
  Template.stationPicker.stations = function() {
    var id = Session.get('selectedSimulator')._id;
    return Stations.find({simulatorId: id});
  };
  
  Template.stationPicker.selectedSimulator = function() {
    return Session.get('selectedSimulator');
  };
}());