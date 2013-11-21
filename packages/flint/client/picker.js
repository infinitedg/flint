Template.core_simulatorPicker.simulators = function() {
	return Flint.collection("simulators").find({},{sort: {name: 1}});
}

Template.core_stationPicker.stations = function() {
  return Flint.collection("stations").find({},{sort: {name: 1}});
}