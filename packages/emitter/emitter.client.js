EventEmitter = function() {
  
  // Check that the user uses "new" keyword for api consistency
  if (!(this instanceof EventEmitter))
    throw new Error('EventEmitter missing "new" keyword');

  // Use the jQuery api
  var eventEmitter = $({});

  // Limit scope by wrapping on and emit
  var api = {
    on: function eventEmitter_on(eventName, callback) {
      return eventEmitter.on(eventName, function() {
        var args = Array.prototype.slice.call(arguments);
        var evt = args.shift();
        callback.apply(evt, args);
      });
    },
    once: function eventEmitter_one(eventName, callback) {
      return eventEmitter.one(eventName, function() {
        var args = Array.prototype.slice.call(arguments);
        var evt = args.shift();
        callback.apply(evt, args);
      });      
    },
    emit: function eventEmitter_emit() {
      var args = Array.prototype.slice.call(arguments);
      var eventName = args.shift();
      return eventEmitter.triggerHandler(eventName, args);
    },
    off: function eventEmitter_off() {
      return eventEmitter.off.apply(eventEmitter, arguments);
    },
  };

  // Add api helpers
  api.addListener = api.on;
  api.removeListener = api.off;
  api.removeAllListeners = api.off;

  // Add jquery like helpers
  api.one = api.once;
  api.trigger = api.emit;

  return api;
};
