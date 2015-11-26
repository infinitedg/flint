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
          //Flint.say("Power");
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

debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

var setEfficiency = debounce(function(context,value){
  if (typeof value !== 'undefined'){
    Flint.collection('systems').update({_id: context._id},{$set: {efficiency: 0}});
    return;
  }
  bootbox.prompt({
    title:"Enter new efficiency for " + this.name,
    value: context.efficiency,
    callback:function(result) {
      if (result !== undefined) {
        Flint.collection('systems').update({_id: context._id},{$set: {efficiency: parseInt(result,10)}});
      }
    }
  });
},200);

Template.core_power.events({
  /**
  Manually change the power for a given system via prompt.
  @method dblclick .systemPower
  */
  'dblclick .systemPower': function() {
    var context = this;
    bootbox.prompt({
      title:"Enter new power for " + this.name,
      value: context.power,
      callback:function(result) {
        if (result !== undefined && result !== null) {
          Flint.collection('systems').update({_id: context._id},{$set: {power: parseInt(result,10)}});
        }
      }
    });
  },
  'click .efficiency':function(){
    setEfficiency(this);
  },
  'dblclick .efficiency':function(){
    setEfficiency(this,0);
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
