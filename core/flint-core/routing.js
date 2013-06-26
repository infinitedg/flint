Meteor.Router.filters({
  'checkLoaded' : function(page) {
    var loading = Utils.memoize(function() {
      return (! Flint.client() ||
        (Flint.stationId() && !Flint.station()) ||
        (Flint.simulatorId() && !Flint.simulator()));
    });

    if (loading())
      return 'loading';
    else
      return page;
  }
});

Meteor.Router.filter('checkLoaded', {except: 'admin'});
