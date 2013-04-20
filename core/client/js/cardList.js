(function (){
  'use strict';
  
  Template.cardList.isCurrentCard = function() {
    return Flint.cardId() === this.cardId;
  };
  
  Template.cardList.events = {
    'click a': function(e) {
      Flint.beep();
      Flint.setCardId(this.cardId);
      e.preventDefault();
    }
  };
}());