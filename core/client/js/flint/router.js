Meteor.Router.add({
  '/': function() {
    Flint.Log.verbose("Routed to /", "Router");
    if (!Session.get('station')) {
      return 'stationPicker';
    } else {
      if (!Flint.isStationPrepared()) {
        Flint.prepareStation(Session.get('station'));
      }
      Flint.play('sciences.wav');
      return 'layout_' + Session.get('layout');
    }
  },
  '/reset': function() {
    Flint.Log.verbose("Routed to /reset", "Router");
    Cookie.remove('station');
    Session.set('station', undefined);
    Session.set('simulator', undefined);
    Session.set('theme', undefined);
    Session.set('layout', undefined);
    Session.set('selectedSimulator', undefined);
    Session.set('currentCard', undefined);
    Session.set('loggedIn', false);
    Session.set('currentUser', undefined);
    Meteor.defer(function() { // Fire away on next run loop
      Meteor.Router.to('/');
    });
  }
});
