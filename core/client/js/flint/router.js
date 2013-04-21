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
    
      var loading = Utils.memoize(function() {
        return (! Flint.client() ||
          (Flint.stationId() && !Flint.station()) ||
          (Flint.simulatorId() && !Flint.simulator()));
      });
    
      if (loading())
        return 'layout_loading';
      if (! Flint.stationId())
        return 'stationPicker';
    
      return page;
    }
  });

  Meteor.Router.filter('checkLoaded');
}());