Utils = this.Utils || {};

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