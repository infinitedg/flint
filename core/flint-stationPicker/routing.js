Meteor.Router.filters({
  'pickStation' : function(page) {
    if (Flint.client() && ! Flint.stationId())
      return 'stationPicker';
  
    return page;
  }
});

Meteor.Router.filter('pickStation', { except: ['flintAdmin'] });
