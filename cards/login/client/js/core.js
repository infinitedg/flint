(function (){
	'use strict';
	
	Template.core_login.stations = function() {
		var simId = Stations.findOne(Session.get('station')).simulatorId;
		var stations = Stations.find({simulatorId: simId});
		return stations;
	};
}());