/**
* Filter for properly displaying the stationPicker when we do not have a station loaded
*/
Meteor.Router.filters({
  'pickStation' : function(page) {
    if (Flint.client() && ! Flint.stationId())
      return 'stationPicker';
  
    return page;
  }
});

Meteor.Router.filter('pickStation');
