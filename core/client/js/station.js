var Flint = Flint || {};

(function () {
  'use strict';
  
  Meteor.startup(function() {
    Session.set('station', Cookie.get('station'));
  });
  
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
    
    
    getStation: function() {
      var i = Session.get('station');
      if (i !== undefined) {
        return Stations.findOne(i);
      } else {
        return undefined;
      }
    },
    getSimulator: function() {
      var i = Session.get('station');
      if (i !== undefined) {
        return Simulators.findOne(Flint.getStation().simulatorId);
      } else {
        return undefined;
      }
    }
  });
  
}());