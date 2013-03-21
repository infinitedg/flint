(function (){
  'use strict';
  
  Template.cardList.cards = function() {
    var station = Stations.findOne({_id: Session.get('station')});
    if (station) {
      return station.cards;
    } else {
      return [];
    }
  };
  
  Template.cardList.isCurrentCard = function(cardId) {
    return Session.equals('currentCard', cardId);
  };
  
  Template.cardList.stationName = function() {
    return Session.get('currentStation');
  };
  
  Template.cardList.events = {
    'click a': function(e) {
      Flint.beep();
      Session.set('currentCard', this.cardId);
    }
  };
}());