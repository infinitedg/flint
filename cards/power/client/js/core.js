(function () {
	'use strict';
	
	Template.core_power.events = {
		
	};

	Template.core_power.systems = function() {
		return Systems.find({});
	};
	
	Template.core_power.totalPower = function() {
		var systems = Systems.find({});
		var totalPower = 0;
		systems.forEach(function(system){
			totalPower += system.power;
		});
		
		return totalPower;
	};
	
	Template.core_power.totalPowerAvailable = function() {
		var station = Stations.findOne({_id: Session.get('station')});
		var simulator = Simulators.findOne({_id: station.simulatorId});
		var totalPower = simulator.power;
		return totalPower;
	};
	
}());
