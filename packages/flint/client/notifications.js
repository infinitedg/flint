/**
@class Flint
*/

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
  
  if (window.webkitNotifications) { // @TODO Chrome's notifications are annoying.
    if (window.webkitNotifications.checkPermission() === 0) {
      options.title = options.title || "Flint";
      options.icon = options.icon || "icon.png";
      var n = window.webkitNotifications.createNotification(options.icon, options.title, message);
      n.show();
      setTimeout(function() {
        n.close();
      }, 5000);
    } else {
      window.webkitNotifications.requestPermission(function(r) {
        console.log(r);
      });
    }
  } else {
  
    $.bootstrapGrowl(message, options);
  }
};