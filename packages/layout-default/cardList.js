/**
@module Templates
@submodule Layouts
*/
 
/**
Subtemplate to layout_default
@class layout_default_cardList
*/

/**
Returns if a given card is the currently visible card
@property isCurrentCard
@type Boolean
*/
Template.layout_default_cardList.isCurrentCard = function() {
  return Flint.cardId() === this.cardId;
};

Template.layout_default_cardList.station = function() {
  return Flint.station();
};

Template.layout_default_cardList.events = {
  /**
  Swap between cards in the list
  @method click a
  */
  'click a': function(e, t) {
    Flint.beep();
    if ('' + this.cardId !== Flint.cardId() + '') { // Cast to strings
      that = this;
      $('body').toggleClass('menu-open');
      $('.card-area').fadeOut(function(){
        Router.go('flint_station', {
          simulatorId: that.simulatorId,
          stationId: that.stationId,
          cardId: that.cardId
        });
      });
    }
    e.preventDefault();
  }
};

Template.layout_default_cardList.created = function() {
  Router.after(function() {
    $('.card-area').fadeIn();
  }, {
    name: 'layout_default_fading'
  });
};

Template.layout_default_cardList.destroyed = function() {
  // Remove hook for fading in after a template has loaded
  
  // Find the element
  var h = _.find(Router._globalHooks.after, function(hook){
    return (hook.options.name === 'layout_default_fading');
  });
  // Get its index
  var i = Router._globalHooks.after.indexOf(h);
  // Splice it!
  Router._globalHooks.after.splice(i, 1);
};

Template.layout_default_cardList.cards = function() {
  var cards = Flint.station().cards;
  var x = _.map(cards, function(card, i) {
    return _.extend(card, {simulatorId: Flint.simulator()._id, stationId: Flint.station()._id, cardId: i });
  });

  return x;
}