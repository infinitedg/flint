Flint = this.Flint || {};

/**
 * Flint.notify to issue a message and a tooltip
 * @param {String} The message to show
 * @param {Object} Options to pass to [BootstrapGrowl](https://github.com/ifightcrime/bootstrap-growl)
 */
Flint.notify = function(message, options) {
  options = options || {};
  
  if (options.speak)
    Flint.say(message);
  options.speak = undefined;
  
  $.bootstrapGrowl(message, options);
};