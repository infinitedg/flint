/**
@module Templates
@submodule Layouts
*/
 
/**
Subtemplate to layout_default
@class layout_default_cardlist
*/

/**
Returns if a given card is the currently visible card
@property isCurrentCard
@type Boolean
*/
Template.layout_default_cardList.isCurrentCard = function() {
  return Flint.cardId() === this.cardId;
};

Template.layout_default_cardList.events = {
  /**
  Swap between cards in the list
  @method click a
  */
  'click a': function(e) {
    Flint.beep();
    Flint.setCardId(this.cardId);
    e.preventDefault();
  }
};