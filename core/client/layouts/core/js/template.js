(function() {
  Template.layout_core.created = function() {
    var context = this;
    Meteor.defer(function() {
      $(context.find('.masonryBox')).masonry({
        itemSelector: '.coreCard',
        columnWidth: function(containerWidth) {
          return containerWidth / 5;
        }
      });
    });
  };
  
  Template.layout_core.simulator = function() {
    return Flint.getSimulator();
  };
  
  Template.layout_core.station = function() {
    return Flint.getStation();
  };
  
  Template.layout_core.currentCard = function() {
    var t1 = this.cardId;
    Session.setDefault('currentCard', Template.layout_core.cards()[0].cardId);
    return Session.equals('currentCard', t1);
  };
  
  Template.layout_core.currentUser = function() {
    return Session.get('username');
  };
  
  Template.layout_core.loggedIn = function() {
    return Session.equals('loggedIn', true);
  };
  
  Template.layout_core.cards = function() {
    return Flint.getStation().cards;
  };
}());