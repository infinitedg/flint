Template.flint_simulatorPicker.simulators = function() {
	return Flint.collection("simulators").find({},{sort: {name: 1}});
};

Template.flint_stationPicker.stations = function() {
  return Flint.collection("stations").find({},{sort: {name: 1}});
};

Template.flint_theme.theme = function() {
  return Flint.theme();
};

Flint.theme = Utils.memoize(function() {
  if (Flint.station() && Flint.simulator()) {
  	var theme = Flint.client('theme') || Flint.station().theme || Flint.simulator().theme || 'default';

  	return '/themes/' + theme + '/css/theme.css';
  }
});