/**
@class Flint
*/
Flint = this.Flint || {};

/**
 * Issue a message and a tooltip
 * @method notify
 * @param {String} The message to show
 * @param {Object} [options] Options to pass to [BootstrapGrowl](https://github.com/ifightcrime/bootstrap-growl)
 */
Flint.notify = function(message, options) {
  options = options || {};
  
  if (options.speak)
    Flint.say(message);
  options.speak = undefined;
  
  $.bootstrapGrowl(message, options);
};