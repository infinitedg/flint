Template.flint_simulatorPicker.simulators = function() {
	return Flint.simulators.find({},{sort: {name: 1}});
};

Template.flint_stationPicker.stations = function() {
  return Flint.stations.find({},{sort: {name: 1}});
};

Template.flint_theme.theme = function() {
  return Flint.theme();
};
