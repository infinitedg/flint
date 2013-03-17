Meteor.Router.add({
  '/': function() {
    if (!Session.get('station')) {
      return 'stationPicker';
    } else {
      // Figure out which layout we should be using
      var id = Session.get('station');
      var station = Stations.findOne(id);
      if (station) {
        var simulator = Simulators.findOne(station.simulatorId);
        var layout = (station.layout) ? station.layout : simulator.layout;
        layout = (layout) ? layout : 'default';
        return 'layout_' + layout;
      }
      Flint.play('sciences.wav');
    }
  },
  '/reset': function() {
    Cookie.remove('station');
    Meteor.defer(function() { // Fire away on next run loop
      Meteor.Router.to('/');
    });
  }
});
