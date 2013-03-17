(function () {
  'use strict';
  
  Template.stationPicker.events({
    'click button.simulator': function(event) {
      Flint.beep();
      Session.set('selectedSimulator', this);
    },
    'click button.station': function(event) {
      Session.set('selectedStation', this);
      Cookie.set('station', this._id);
      Session.set('station', this._id);
    }
  });
  
  Template.stationPicker.simulators = function() {
    return Simulators.find({});
  };
  
  Template.stationPicker.stations = function() {
    var id = Session.get('selectedSimulator')._id;
    return Stations.find({simulatorId: id});
  };
  
  Template.stationPicker.selectedSimulator = function() {
    return Session.get('selectedSimulator');
  };
  
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
    
  Template.programming_tools.programmingEnabled = function() {
    return Session.get('_programming');
  };
  
  Template.themePicker.theme = function() {
    var station = Stations.findOne({_id: Session.get('station')});
    if (station) {
      var simulator = Simulators.findOne({_id: station.simulatorId});
      if (simulator.theme) {
        return simulator.theme;
      }
    } else {
      return false;
    }
  };
  
}());