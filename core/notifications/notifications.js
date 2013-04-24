Flint = this.Flint || {};

Flint.notify = function(message, options) {
  options = options || {};
  
  if (options.speak)
    Flint.say(message);
  options.speak = undefined;
  
  $.bootstrapGrowl(message, options);
};