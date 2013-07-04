/**
 * Convenience method for rendering templates safely
 * @param {String} name The name of the template to render
 * @param {Object} [options] Map of options to be passed to handlebars
 * @private
 */
var render = function(name, options) {
  if (Template[name]) {
    return new Handlebars.SafeString(Template[name]());
  }
};

Handlebars.registerHelper('render', render);

/**
 * renderCard helper for Hanldebars - Renders station cards
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('renderCard', function(name, options) {
  Flint.Log.verbose("renderCard");
  return render('card_' + name, options);
});

/**
 * renderCore helper for Hanldebars - Renders core cards
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('renderCore', function(name, options) {
  return render('core_' + name, options);
});

/**
 * renderLayout helper for Hanldebars - Renders layouts
 * @param {String} name The name of the card to render
 * @param {Object} [options] Optional values to be passed to handlebars
 */
Handlebars.registerHelper('renderLayout', function(name, options) {
  return render('layout_' + name, options);
});