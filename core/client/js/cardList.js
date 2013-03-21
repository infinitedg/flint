(function (){
  'use strict';
  
  Template.cardList.cards = function() {
    return Flint.getStation().cards;
  };
  
  Template.cardList.isCurrentCard = function(cardId) {
    return Session.equals('currentCard', cardId);
  };
  
  Template.cardList.stationName = function() {
    return Flint.getStation(false).name;
  };
  
  Template.cardList.events = {
    'click a': function(e) {
      Flint.beep();
      Session.set('currentCard', this.cardId);
      e.preventDefault();
    }
  };
}());