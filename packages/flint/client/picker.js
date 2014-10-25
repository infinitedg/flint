Template.flint_simulatorPicker.helpers({
	simulators: function() {
		return Flint.simulators.find({},{sort: {name: 1}});
	},
	stations: function() {
		return Flint.stations.find({},{sort: {name: 1}});
	}
});
