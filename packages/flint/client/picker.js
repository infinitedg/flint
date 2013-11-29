Template.flint_simulatorPicker.simulators = function() {
	return Flint.collection("simulators").find({},{sort: {name: 1}});
};

Template.flint_stationPicker.stations = function() {
  return Flint.collection("stations").find({},{sort: {name: 1}});
};

Template.flint_theme.theme = function() {
  return Flint.theme();
};

var themeDep = new Deps.Dependency;
Flint.theme = function() {
  themeDep.depend();
  var station = Flint.station();
  var simulator = Flint.simulator();

  if (Flint.station() && Flint.simulator()) {
  	var theme = Flint.station().theme || Flint.simulator().theme || 'default';

  	return '/themes/' + theme + '/css/theme.css';
  }
};