/**
@module Templates
@submodule Layouts
*/
 
/**
Subtemplate to layout_admin
@class layout_admin_cardList
*/

/**
Returns if a given card is the currently visible card
@property isCurrentCard
@type Boolean
*/

Template.layout_admin_cardList.helpers({
  isCurrentCard: function() {
    return Flint.cardNumber() === this.cardId;
  },
  station: function() {
    return Flint.station();
  },
  cards: function() {
    var cards = Flint.station().cards;
    var x = _.map(cards, function(card, i) {
      return _.extend(card, {simulatorId: Flint.simulator()._id, stationId: Flint.station()._id, cardId: i });
    });

    return x;
  }
});

Template.layout_admin_cardList.events({
  /**
  Swap between cards in the list
  @method click a
  */
  'click a': function(e, t) {
    Flint.beep();
    if ('' + this.cardId !== Flint.cardNumber() + '') { // Cast to strings
      that = this;
        
        Router.go('flint_station', {
          simulatorId: that.simulatorId,
          stationId: that.stationId,
          cardId: that.cardId
        });
                         
   }
    e.preventDefault();
  }
});

Template.layout_admin_cardList.created = function() {
  Router.onAfterAction(function() {
    $('.card-area').fadeIn();
  }, {
    name: 'layout_admin_fading'
  });
};

Template.layout_admin_cardList.destroyed = function() {
  // Remove hook for fading in after a template has loaded
  
  // Find the element
  var h = _.find(Router._globalHooks.onAfterAction, function(hook){
    return (hook.options.name === 'layout_admin_fading');
  });
  // Get its index
  var i = Router._globalHooks.onAfterAction.indexOf(h);
  // Splice it!
  Router._globalHooks.onAfterAction.splice(i, 1);
};