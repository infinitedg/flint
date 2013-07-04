Flint = this.Flint || {};
(function() {
  "use strict";
  
  var Actor = function Actor(key, startCallback, stopCallback) {
    var self = this;
    self.key = key;
    self.started = false;
    
    var intervals = [];
    var timeouts = [];
    
    _.extend(self, {
      setInterval: function(func, delay) {
        var id = Meteor.setInterval(func, delay);
        intervals.push(id);
        return id;
      },
      clearInterval: function(id) {
        Meteor.clearInterval(id);
        intervals.splice(intervals.indexOf(id), 1);
      },
      setTimeout: function(func, delay) {
        var id = Meteor.setTimeout(function() {
          timeouts.splice(timeouts.indexOf(id), 1);
          func();
        }, delay);
        timeouts.push(id);
        return id;
      },
      clearTimeout: function(id) {
        Meteor.clearTimeout(id);
        timeouts.splice(timeouts.indexOf(id), 1);
      },
    
      start: function() {
        if (self.started)
          return;
        (_.bind(startCallback, self)());
        self.started = true;
      },
      stop: function() {
        if (! self.started)
          return;
        stopCallback && (_.bind(stopCallback, self)());
        _.each(intervals, self.clearInterval);
        _.each(timeouts, self.clearTimeout);
        self.started = false;
      },
      restart: function() {
        if (self.started)
          self.stop();
        self.start();
      }
    }); // extend
  };
  
  Flint.actors = [];
  Flint.addActor = function(key, start, stop) {
    Flint.actors[key] = new Actor(key, start, stop);
  };
  
}());