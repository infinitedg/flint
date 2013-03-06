Meteor.startup(function () {
	var simulators = Simulators.find({});
	if (simulators.count() < 1) { // Install fixtures
		
		Log.info("Rebuilding database", "server");
		
		Simulators.insert({
			"name": "USS Odyssey",
			"_id": "Dck3AxjjmNFZgR8u5"
		});
		
		Simulators.insert({
			"name": "USS Phoenix",
			"_id": "dX2EuPNoSA2tmBBbH"
		});
		
		Simulators.insert({
			"_id": "8ofeYktqCx3SEGgpx",
			"name": "USS Voyager",
			"power": 120
		});
		
		Stations.insert({
			"_id": "N9h4coBbhLTHHEYud",
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
			"simulator": "8ofeYktqCx3SEGgpx"
		});
		
		Systems.insert({
			"name": "Short Range Communications",
			"minPower": 5,
			"maxPower": 20,
			"power": 7,
			"_id": "nprnQfbti8XBbQ42W"
		});
		
		Systems.insert({
			"name": "Torpedo Launchers",
			"minPower": 7,
			"maxPower": 30,
			"power": 10,
			"_id": "8DnWtrhdxC55PcY9a"
		});
		
		Systems.insert({
			"name": "Phasers",
			"minPower": 7,
			"maxPower": 30,
			"power": 10,
			"_id": "erisBfgr5uC568EZj"
		});
		
		Systems.insert({
			"name": "Warp Core",
			"minPower": 5,
			"maxPower": 20,
			"power": 7,
			"_id": "bPob55YS8CPcnSr6w"
		});
	}
});
