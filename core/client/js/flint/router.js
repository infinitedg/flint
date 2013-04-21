(function() {
  'use strict';
  Meteor.Router.add({
    '/': function() {
      return 'layout_' + Flint.layout();
    },
    '/reset': function() {
      // Wait until we have a clientId to reset
      if (Flint.clientId()) {
        Flint.resetClient();
        Deps.afterFlush(function() {
          Meteor.Router.to('/');
        });
      }
    }
  });

  Meteor.Router.filters({
    'checkLoaded' : function(page) {
    
      var clientExists = Utils.memoize(function() {
        return !! Flint.client();
      });
    
      if (! clientExists())
        return 'layout_loading';
      if (! Flint.stationId())
        return 'stationPicker';
    
      return page;
    }
  });

  Meteor.Router.filter('checkLoaded');
}());