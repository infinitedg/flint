Flint = this.Flint || {};

(function () {
  'use strict';
  
  _.extend(Flint, {
    
    transitionSpeed: 200,
    programmingEnabled: function(tf) {
      tf = (tf === undefined) ? true : tf;
      Session.set('_programming', (tf === true));
    },
    setMenubar: function() {
      Session.set('_programming', false);
    },
    // Choose a new station identity
    reselect: function() {
      Meteor.Router.to('/reset');
    },
    
    // Prepare static session variables based on StationID
    prepareStation: function(stationId) {
      if (stationId === undefined) {
        stationId = Cookie.get('station');
      }
      Flint.Log.verbose("Loading station " + stationId, "Core");
      var station = Stations.findOne({_id: stationId});
      if (station === undefined) { // The database is not ready yet. Please hold...
        Flint.Log.verbose("Database not ready - deferring render...", "Core");
        return false;
      }
      var simulator = Simulators.findOne({_id: station.simulatorId});
      
      // Calculate theme once to prevent re-rendering
      var theme = (station.theme) ? station.theme : simulator.theme;
      theme = (theme) ? theme : 'default';
      Session.set('theme', theme);
      
      // Calculate layout once to prevent re-rendering
      var layout = (station.layout) ? station.layout : simulator.layout;
      layout = (layout) ? layout : 'default';
      Session.set('layout', layout);
      
      Cookie.set('station', station._id);
      Session.set('station', station);
      Session.set('simulator', simulator);
      Session.set('currentCard', station.cards[0].cardId);
      Flint.Log.verbose("Loaded station " + stationId, "Core");
    },
    
    // Determine if the station is ready to be launched
    isStationPrepared: function() {
      return !Session.equals('station', undefined) &&
        !Session.equals('simulator', undefined) &&
        !Session.equals('layout', undefined) &&
        !Session.equals('theme', undefined);
    },
    
    resetSession: function() {
      Session.set('station', undefined);
      Session.set('simulator', undefined);
      Session.set('theme', undefined);
      Session.set('layout', undefined);
      Session.set('selectedSimulator', undefined);
      Session.set('currentCard', undefined);
      Session.set('loggedIn', false);
      Session.set('currentUser', undefined);
      Participants.remove(Session.get('participantId'));
      Session.set('participantId', undefined);
      Flint.Log.verbose("Session reset", "Core");
    },
    
    resetHard: function() {
      Flint.resetSession();
      Cookie.remove('station');
      Flint.Log.verbose("Hard reset complete", "Core");
    },
    
    notification: function(message, options) {
      // Prep options
      if (options === undefined) {
        options = {};
      }
      $.bootstrapGrowl(message, options);
      // From https://github.com/ifightcrime/bootstrap-growl
      
    },
    notify: function(message, options) {
      Flint.say(message);
      Flint.notification(message, options);
    },
    
    // If reactive (or unspecified), then return a reactive data source
    // Note: Clearly Session.get returns a reactive data source.
    // By convention, the session variables 'simulator', 'station', 'theme', and 'layout'
    // Are not to be touched
    getStation: function(reactive) {
      if (reactive === undefined || reactive) {
        var i = Session.get('station');
        if (i !== undefined) {
          return Stations.findOne(i._id) || {};
        } else {
          return {};
        }
      } else {
        return Session.get('station');
      }
    },
    
    // If reactive (or unspecified), then return a reactive data source
    // Note: Clearly Session.get returns a reactive data source.
    // By convention, the session variables 'simulator', 'station', 'theme', and 'layout'
    // Are not to be touched
    getSimulator: function(reactive) {
      if (reactive === undefined || reactive) {
        var i = Session.get('station');
        if (i !== undefined) {
          return Simulators.findOne(Flint.getStation().simulatorId) || {};
        } else {
          return {};
        }
      } else {
        return Session.get('simulator');
      }
    }
  });
  
}());