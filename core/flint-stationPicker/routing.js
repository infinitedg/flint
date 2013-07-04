/**
@class Router.Filters
*/

/**
Filter for properly displaying the stationPicker when we do not have a station loaded. Ignored by flintAdmin.
@method checkLoaded
@return {String} The page to be loaded or the template "stationPicker" (defined in `flint-stationPicker`)
*/
Meteor.Router.filters({
  'pickStation' : function(page) {
    if (Flint.client() && ! Flint.stationId())
      return 'stationPicker';
  
    return page;
  }
});

Meteor.Router.filter('pickStation', { except: ['flintAdmin'] });
