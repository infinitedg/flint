// Bindings for admin template
Meteor.Router.add({
  '/admin': 'flintAdmin'
});

Template.flintAdmin.created = function() {
  this.subComputation = Deps.autorun(function() {
    Meteor.subscribe("flintAdmin.simulators");
    Meteor.subscribe("flintAdmin.stations", Session.get("selectedSimulatorId"));
  });
};

Template.flintAdmin.destroyed = function() {
  this.subComputation.stop();
};

Template.flintAdmin.simulators = function() {
  return Flint.simulators.find();
};

Template.flintAdmin.stations = function() {
  return Flint.stations.find();
};

Template.flintAdmin.cards = function() {
  var station = Flint.stations.findOne(Session.get('selectedStationId'));
  
  window.test = station;
  
  if (station) {
    return station.cards;
  }
};

Template.flintAdmin.events({
  'click a.simulator': function() {
    Session.set('selectedSimulatorId', this._id);
    return false;
  },
  'click a.station': function() {
    Session.set('selectedStationId', this._id);
    return false;
  }
});