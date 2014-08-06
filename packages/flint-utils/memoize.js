/**
@module Core Functionality
*/

/**
* @class Utils
*/
Utils = {};

// @TODO Have Dan verify this documentation since he knows what this is supposed to do
 
/**
* Create a reactive datasource derived from the results of the given function, preventing reactive computation invalidations when the function's result hasn't actually changed
* @method memoize
* @param {Function} func Function to evaluate
*/
Utils.memoize = function(func) {
  
  var value;
  var dep;

  return function() {
    if (!dep) {
      dep = new Deps.Dependency();
      
      // Create a new computation.
      Deps.nonreactive(function() {
        Deps.autorun(function() {
          
          var newValue = func();
          var changed = !_.isEqual(value, newValue);
          value = newValue;

          if (!this.firstRun && changed)
            dep.changed();
        });
      });
    }
    
    dep.depend();
    return value;
  };
};