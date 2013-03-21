(function() {
  'use strict';
  
  Meteor.Router.add({
    '/': function() {
      Flint.Log.verbose("Routed to /", "Router");
      if (Flint.getStation(false) === undefined && Cookie.get('station') === undefined) {
        Flint.resetSession(); // Ensure a clean environment
        Flint.Log.verbose("Presenting Station Picker", "Router");
        return 'stationPicker';
      } else {
        if (!Flint.isStationPrepared()) {
          var station = Flint.getStation(false);
          var id = (station) ? station._id : Cookie.get('station');
          Flint.prepareStation(id);
          /**
          * To prevent a double-render of the station's layout
          * Meteor will re-run the '/' route in a moment
          * and because the station is now prepared, we skip this if block.
          */
          return 'layout_loading';
        }
        var layout = Session.get('layout');
        layout = (Template['layout_' + layout] !== undefined) ? layout : 'loading';
        Flint.Log.verbose("Rendering layout " + layout, "Router");
        
        return 'layout_' + layout;
      }
    },
    '/reset': function() {
      Flint.Log.verbose("Routed to /reset", "Router");
      Flint.resetHard();
      Meteor.defer(function() { // Fire away on next run loop
        Meteor.Router.to('/');
      });
    }
  });
}());