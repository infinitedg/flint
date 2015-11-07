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
  that = this;
  this.subComputation = Tracker.autorun(function() {
    Meteor.subscribe("cards.power.systems", Flint.simulatorId());

    that.observer = Flint.collection('systems').find().observeChanges({
      changed: function(id, fields) {
        if (fields.power) {
          Flint.say("Power");
        }
      }
    });
  });
};

/**
Teardown subscription to cards.power.systems
@method destroyed
*/
Template.core_power.destroyed = function() {
  this.subComputation.stop();
  this.observer.stop();
};

Template.core_power.events({
  /**
  Manually change the power for a given system via prompt.
  @method dblclick .systemPower
  */
  'dblclick .systemPower': function() {
    var context = this;
    bootbox.prompt("Enter new power for " + this.name, 'Cancel', 'OK', function(result) {
      if (result !== undefined) {
        Flint.collection('systems').update({_id: context._id},{$set: {power: result}});
      }
    }, context.power);
  }
});


Template.core_power.helpers({
  /**
  The list of systems available
  @property systems
  @type Meteor.Collection
  */
  systems: function() {
    return Flint.collection('systems').find({});
  },
  /**
  The total power in use.
  @property totalPower
  @type Number
  */
  totalPower: function() {
    return _.reduce(Flint.collection('systems').find().fetch(), function(memo, doc) {
      var i = parseInt(doc.power, 10);
      if (isNaN(i)) {
        i = 0;
      }
      return i + memo;
    }, 0);
  },
  /**
  The total power available to the simulator.
  @property totalPowerAvailable
  @type Number
  */
  totalPowerAvailable: function() {
    return Flint.simulator().power;
  }
});
