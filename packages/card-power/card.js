/**
@module Templates
@submodule Cards
*/
 
/**
Power balancing screen. Originally developed as a demo.
@class card_power
*/


/**
Create a subscripton to cards.power.systems and save for later teardown
@method created
*/
Template.card_power.created = function() {
  this.subComputation = Deps.autorun(function() {
    Meteor.subscribe("cards.power.systems", Flint.simulatorId());
  });
};

/**
Teardown subscription to cards.power.systems
@method destroyed
*/
Template.card_power.destroyed = function() {
  this.subComputation.stop();
};

Template.card_power.events = {
  /**
  Update the power level when the progress bar is tapped
  @method click div.progress
  */
  'click div.progress': function(e, context) {
    Flint.beep();
    var relX = e.pageX - $(e.target).position().left;
    // var relY = e.pageY - $(e.target).position().top;
    var el = ($(e.target).hasClass('progress')) ? $(e.target) : $(e.target).parent('.progress');
    var ratioW = (relX / el.width());
    var newPower = Math.round(ratioW * this.maxPower);
    Flint.collection('systems').update({ _id: this._id }, { $set: {power: newPower}});
  }
};

/**
The list of systems
@property systems
@type Meteor.Collection
*/
Template.card_power.helpers({
  systems: function() {
    return Flint.collection('systems').find();
  },
  /**
  The percentage level of a given bar. Used in a handlebars {{#each}} loop.
  @property barPercent
  @type Number
  */
  barPercent: function() {
    return (this.power / this.maxPower) * 100;
  },
  /**
  The bootstrap class for a bar based on its power level. Used in a handlebars {{#each}} loop.
  @property barClass
  @type String
  */
  barClass: function() {
    var level = (this.power / this.maxPower) * 100;
    if (level < 25) {
      return 'danger';
    } else if (level < 50) {
      return 'warning';
    } else if (level < 75) {
      return 'info';
    } else {
      return 'success';
    }
  },
  /**
  The total power consumed by the system
  @property totalPower
  @type Number
  */
  totalPower: function() {
    var totalPower = 0;
    Flint.collection('systems').find().forEach(function(system){
      totalPower += parseInt(system.power, 10);
    });
    
    return totalPower;
  },
  /**
  The total power available to the current simulator
  @property totalPowerAvailable
  @type Number
  */
  totalPowerAvailable: function() {
    if (Flint.simulator())
      return Flint.simulator().power;
  }
});