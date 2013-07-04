/**
@module Core Functionality
*/
/**
@class Flint
*/
Flint = this.Flint || {};

var flashInterval = 50;
var flashTargets = [];

_.extend(Flint, {
  
  /**
   * Invert the screen a specified number of times
   * 
   * @method flash
   * @param {Number} times The number of times to flash. May also be a CSS selector
   * @param {String} [flashTarget] CSS selector for the element to be targeted, if not provided defaults to 'html'
  */
  flash: function(times, flashTarget) {
    if (isNaN(times) || times < 0) {
      if ($(times)) { // If times is actually a CSS selector...
        flashTarget = times;
      }
      times = 10; // Default number of flashes
    }
    
    if (flashTarget === undefined) {
      flashTarget = 'html';
    }
    
    // Don't run if we're already flashing
    if (flashTargets.indexOf(flashTarget) !== -1) {
      return;
    }
    
    flashTargets.push(flashTarget);
    
    var _flashTarget = $(flashTarget);
    
    Flint.Log.verbose("Flashing '" + flashTarget + "' " + times + " times", "Effects");
    
    // Invert the screen. willInvert will invert the screen with truthy values, set it normal with falsey values
    var inverter = function (willInvert) {
      var x;
      if (willInvert === undefined) {
        x = (_flashTarget.css('-webkit-filter') === "invert(0)") ? 1 : 0;
      } else {
        x = (willInvert) ? 1 : 0;
      }
      _flashTarget.css('-webkit-filter','invert(' + x + ')');
    };
    
    // Technically, we want the screen to be inverted 10 times.
    // Because an inversion is 2 invert operations, we double the number of times flashed.
    times = times * 2;
    
    var flashIntervalId = Meteor.setInterval(function() {
      if (times < 0) {
        inverter(false);
        flashTargets.splice(flashTargets.indexOf(flashTarget), 1);
        Meteor.clearInterval(flashIntervalId);
      } else {
        inverter();
        times--;
      }
    }, flashInterval);
  }
});