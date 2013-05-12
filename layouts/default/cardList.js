Template.layout_default_cardList.isCurrentCard = function() {
  return Flint.cardId() === this.cardId;
};

Template.layout_default_cardList.events = {
  'click a': function(e) {
    Flint.beep();
    Flint.setCardId(this.cardId);
    e.preventDefault();
  }
};