/**
@module Templates
@submodule Core
*/
 
/**
Power balancing screen. Originally developed as a demo.
@class core_power
*/

/**
Setup subscription to cards.power.systems for later teardown
@method created
*/
Template.core_power.created = function() {
  this.subComputation = Deps.autorun(function() {
    Meteor.subscribe("cards.power.systems", Flint.simulatorId());
  });
};

/**
Teardown subscription to cards.power.systems
@method destroyed
*/
Template.core_power.destroyed = function() {
  this.subComputation.stop();
};

Template.core_power.events = {
  /**
  Manually change the power for a given system via prompt.
  @method dblclick .systemPower
  */
  'dblclick .systemPower': function() {
    var context = this;
    bootbox.prompt("Enter new power for " + this.name, 'Cancel', 'OK', function(result) {
      if (result !== undefined) {
        Systems.update({_id: context._id},{$set: {power: result}});
      }
    }, context.power);
  }
};

/**
The list of systems available
@property systems
@type Meteor.Collection
*/
Template.core_power.systems = function() {
  return Systems.find({});
};

/**
The total power in use. Side-effect of saying the current total power in use.
@property totalPower
@type Number
*/
Template.core_power.totalPower = function() {
  Flint.say('power');
  var systems = Systems.find({});
  var totalPower = 0;
  systems.forEach(function(system){
    totalPower += parseInt(system.power, 10);
  });
  return totalPower;
};

/**
The total power available to the simulator.
@property totalPowerAvailable
@type Number
*/
Template.core_power.totalPowerAvailable = function() {
  return Flint.simulator().power;
};