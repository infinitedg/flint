(function (){
  'use strict';
  
  Template.core_login.stations = function() {
    var stations = Stations.find({simulatorId: Flint.getStation(false).simulatorId});
    return stations;
  };
}());