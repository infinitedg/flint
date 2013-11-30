/**
@module Templates
@submodule Layouts
*/
 
/**
Core layout for control room stations
@class layout_core
*/

/**
Setup a 5 column JQuery Masonry layout
@method created
*/
// Template.layout_core.created = function() {
//   var context = this;
//   Meteor.defer(function() {
//     $(context.find('.masonryBox')).masonry({
//       itemSelector: '.coreCard',
//       columnWidth: function(containerWidth) {
//         return containerWidth / 5;
//       }
//     });
//   });
// };

Meteor.startup(function() {
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
	 * `render` helper for Hanldebars - Renders arbitrary templates
	 * @method render
	 * @param {String} name The name of the template to render
	 * @param {Object} [options] Optional values to be passed to handlebars
	 */
	Handlebars.registerHelper('render', _render);
});

Template.layout_core.cards = function() {
	return Flint.station().cards;
};

Template.layout_core.created = function() {
	that = this;
	Meteor.defer(function(){
		salvattore.register_grid(that.find('#grid'));
	});
};