(function() {
  Template.layout_flint.simulator = function() {
    var station = Stations.findOne({_id: Session.get('station')});
    if (station) {
      var simulator = Simulators.findOne({_id: station.simulatorId});
      return simulator;
    } else {
      return {};
    }
  };
  
  Template.layout_flint.station = function() {
    return Stations.findOne({_id: Session.get('station')});
  };
  
  Template.layout_flint.currentCard = function() {
    var t1 = this.cardId;
    Session.setDefault('currentCard', Template.layout_flint.cards()[0].cardId);
    var t2 = Session.get('currentCard');
    if (t1 !== undefined && t2 !== undefined) {
      return (t1 == t2);
    } else {
      return true;
    }
  };
  
  Template.layout_flint.currentUser = function() {
    return Session.get('username');
  };
  
  Template.layout_flint.loggedIn = function() {
    return Session.equals('loggedIn', true);
  };
  
  Template.layout_flint.cards = function() {
    var station = Stations.findOne({_id: Session.get('station')});
    if (station) {
      return station.cards;
    } else {
      return [];
    }
  };
}());