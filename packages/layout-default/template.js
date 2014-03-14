/**
@module Templates
@submodule Layouts
*/
 
/**
Default station layout
@class layout_default
*/

/**
Returns a class to either show or hide the cardList if the user is logged in or out, respectively.
@property hideCardlistCSS
@type String
*/
Template.layout_default.hideCardlistCSS = function() {
  if (Flint.client('name')) {
    return '';
  } else {
    return 'hide';
  }
};

Template.layout_default.events({
	'click .menu-launcher': function(e, t) {
		if (Flint.client('name'))
			$('body').toggleClass('menu-open');
	}
});

Template.layout_default.simulator = function() {
  return Flint.simulator();
}

Template.layout_default.station = function() {
  return Flint.station();
}

Template.layout_default.created = function() {
	Flint.play('sciences');
}