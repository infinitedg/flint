Meteor.startup(function () {
	var simulators = Simulators.find({});
	if (simulators.count() < 1) { // Install fixtures
		
		Flint.Log.info("Rebuilding database", "server");
		
		Simulators.insert({
			"name": "USS Odyssey",
			"_id": "fixed-simulators-odyssey",
			"power": 150,
			"theme": 'odyssey'
		});
		
		Simulators.insert({
			"name": "USS Phoenix",
			"_id": "fixed-simulators-phoenix",
			"power": 100,
			"theme": 'shamrock'
		});
		
		Simulators.insert({
			"_id": "fixed-simulators-voyager",
			"name": "USS Voyager",
			"power": 120,
			"theme": 'flint',
			"layout": 'flint'
		});
		
		Stations.insert({
			"_id": "fixed-stations-voyager-operations",
			"cards": [
				{
					"name": "Login",
					"cardId": "login"
				},
				{
					"name": "Power Distribution",
					"cardId": "power"
				},
				{
					"cardId": "alertCondition",
					"name": "Alert Condition"
				}
			],
			"name": "Operations",
			"simulatorId": "fixed-simulators-voyager"
		});
		
		Stations.insert({
			"cards": [
				{
					"name": "Login",
					"cardId": "login"
				},
				{
					"name": "Power Distribution",
					"cardId": "power"
				},
				{
					"cardId": "alertCondition",
					"name": "Alert Condition"
				}
			],
			"name": "Communications",
			"simulatorId": "fixed-simulators-odyssey",
			"_id": "fixed-stations-odyssey-communications"
		});
		
		Stations.insert({
			"cards": [
				{
					"name": "Login",
					"cardId": "login"
				},
				{
					"name": "Power Distribution",
					"cardId": "power"
				},
				{
					"cardId": "alertCondition",
					"name": "Alert Condition"
				}
			],
			"name": "Engineer",
			"simulatorId": "fixed-simulators-phoenix",
			"_id": "fixed-stations-phoenix-engineer"
		});
		
		Stations.insert({
			"cards": [
				{
					"name": "Stations",
					"cardId": "stations"
				},
				{
					"name": "Power Distribution",
					"cardId": "power"
				},
				{
					"cardId": "alertCondition",
					"name": "Alert Condition"
				}
			],
			"name": "Flight Director",
			"simulatorId": "fixed-simulators-voyager",
			"layout": "core",
			"_id": "fixed-stations-voyager-flightDirector"
		});
		
		Systems.insert({
			"name": "Short Range Communications",
			"minPower": 5,
			"maxPower": 20,
			"power": 7,
			"_id": "systems-srCommunications"
		});
		
		Systems.insert({
			"name": "Torpedo Launchers",
			"minPower": 7,
			"maxPower": 30,
			"power": 10,
			"_id": "systems-torpedoes"
		});
		
		Systems.insert({
			"name": "Phasers",
			"minPower": 7,
			"maxPower": 30,
			"power": 10,
			"_id": "systems-phasers"
		});
		
		Systems.insert({
			"name": "Warp Core",
			"minPower": 5,
			"maxPower": 20,
			"power": 7,
			"_id": "systems-warpCore"
		});
	}
});
