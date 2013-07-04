(function () {
  'use strict';
  
  Template.core_power.created = function() {
    this.subComputation = Deps.autorun(function() {
      Meteor.subscribe("cards.power.systems", Flint.simulatorId());
    });
  };
  
  Template.core_power.destroyed = function() {
    this.subComputation.stop();
  };
  
  Template.core_power.events = {
    'dblclick .systemPower': function() {
      var context = this;
      bootbox.prompt("Enter new power for " + this.name, 'Cancel', 'OK', function(result) {
        if (result !== undefined) {
          Systems.update({_id: context._id},{$set: {power: result}});
        }
      }, context.power);
    }
  };

  Template.core_power.systems = function() {
    return Systems.find({});
  };
  
  Template.core_power.totalPower = function() {
    Flint.say('power');
    var systems = Systems.find({});
    var totalPower = 0;
    systems.forEach(function(system){
      totalPower += parseInt(system.power, 10);
    });
    return totalPower;
  };
  
  Template.core_power.totalPowerAvailable = function() {
    return Flint.simulator().power;
  };
  
}());