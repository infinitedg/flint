/**
@class Handlebars.helpers
*/

/**
 * Convenience method for rendering templates safely
 * @method _render
 * @param {String} name The name of the template to render
 * @param {Object} [options] Map of options to be passed to handlebars
 * @private
 */
var _render = function(name, options) {
  if (Template[name]) {
    return new Handlebars.SafeString(Template[name]());
  }
};

/**
 * `render` helper for Hanldebars - Renders station cards
 * @method render
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('render', _render);

/**
 * `renderCard` helper for Hanldebars - Renders station cards
 * @method renderCard
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('renderCard', function(name, options) {
  Flint.Log.verbose("renderCard");
  return _render('card_' + name, options);
});

/**
 * `renderCore` helper for Hanldebars - Renders core cards
 * @method renderCore
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('renderCore', function(name, options) {
  Flint.Log.verbose("renderCore");
  return _render('core_' + name, options);
});

/**
 * `renderLayout` helper for Hanldebars - Renders layouts
 * @method renderLayout
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('renderLayout', function(name, options) {
  Flint.Log.verbose("renderLayout");
  return _render('layout_' + name, options);
});