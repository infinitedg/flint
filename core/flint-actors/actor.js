Flint = this.Flint || {};
/**
@module Core Functionality
*/

/**
 * Class for creating frequently running processes. May be used to animate properties,
 * watch for various events, and otherwise perform periodic tasks in the background on the server.
 * Available only on the server.
 * @class Actor
*/
var Actor = function Actor(key, startCallback, stopCallback) {
  var self = this;
  self.key = key;
  self.started = false;
  
  var intervals = [];
  var timeouts = [];
  
  _.extend(self, {
    /**
    Establish a function to run at a given interval
    @method setInterval
    @param {Function} func The function to execute periodically
    @param {Number} delay The frequency in milliseconds to run the function
    @return {Handle} A handle created by [`Meteor.setInterval`](http://docs.meteor.com/#meteor_setinterval)
    */
    setInterval: function(func, delay) {
      var id = Meteor.setInterval(func, delay);
      intervals.push(id);
      return id;
    },
    
    /**
    Terminate a periodically running function
    @method clearInterval
    @param {Handle} id A handle returned from setInterval
    */
    clearInterval: function(id) {
      Meteor.clearInterval(id);
      intervals.splice(intervals.indexOf(id), 1);
    },
    
    /**
    Establish a function to be run after a certain interval
    @method setTimeout
    @param {Function} func The function to execute
    @param {Number} delay The interval to wait before triggering the function
    @return {Handle} A handle created by [`Meteor.setTimeout`](http://docs.meteor.com/#meteor_settimeout)
    */
    setTimeout: function(func, delay) {
      var id = Meteor.setTimeout(function() {
        timeouts.splice(timeouts.indexOf(id), 1);
        func();
      }, delay);
      timeouts.push(id);
      return id;
    },
    
    /**
    Cancel a function created with setTimeout from being executed
    @method clearTimeout
    @param {Handle} id A handle returned from setTimeout
    */
    clearTimeout: function(id) {
      Meteor.clearTimeout(id);
      timeouts.splice(timeouts.indexOf(id), 1);
    },
    
    /**
    Begin running the actor
    @method start
    */
    start: function() {
      if (self.started)
        return;
      (_.bind(startCallback, self)());
      self.started = true;
    },
    
    /**
    Stop the actor
    @method stop
    */
    stop: function() {
      if (! self.started)
        return;
      stopCallback && (_.bind(stopCallback, self)());
      _.each(intervals, self.clearInterval);
      _.each(timeouts, self.clearTimeout);
      self.started = false;
    },
    
    /**
    Stop the actor if running, and then start the actor.
    @method restart
    */
    restart: function() {
      if (self.started)
        self.stop();
      self.start();
    }
  }); // extend
};

/**
@class Flint
*/

/**
Collection of actors currently in the system
@property actors
@type array
*/
Flint.actors = [];

/**
Create an actor object. Does not begin running the actor.
@method addActor
@param {String} key A unique key identifying the actor
@param {Function} start Function to call when the actor begins operating
@param {Function} stop Function to call when the actor is stopped
*/
Flint.addActor = function(key, start, stop) {
  Flint.actors[key] = new Actor(key, start, stop);
};
