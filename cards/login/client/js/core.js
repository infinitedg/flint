(function (){
  'use strict';
  
  Template.core_login.stations = function() {
    var stations = Stations.find({simulatorId: Session.get('station').simulatorId});
    return stations;
  };
}());