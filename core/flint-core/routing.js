/**
@class Router.Filters
*/

/**
Determine if the entire system has properly loaded yet
@method checkLoaded
@return {String} The page to be loaded or the template "loading" (defined in `flint-core`)
*/
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
