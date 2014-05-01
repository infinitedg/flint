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

Template.layout_default.events = {
  'mouseup div.pageContent': function(e, context) {
           if ($('.animate').length > 0) {
              var showMenu = document.getElementById( 'showMenu' ),
			 perspectiveWrapper = document.getElementById( 'perspective' ),
			 container = perspectiveWrapper.querySelector( '.pageContent' ),
			 contentWrapper = container.querySelector( '.wrapper' );
        
        $(perspectiveWrapper).removeClass('animate');
		Meteor.setTimeout( function() { $(perspectiveWrapper).removeClass('modalview'); }, 1000);
               
           }
      
  },

  'mouseup div.sim-name': function(e, context) {
            var showMenu = document.getElementById( 'showMenu' ),
			 perspectiveWrapper = document.getElementById( 'perspective' ),
			 container = perspectiveWrapper.querySelector( '.pageContent' ),
			 contentWrapper = container.querySelector( '.wrapper' );
            docscroll = window.pageYOffset || window.document.documentElement.scrollTop; //Finds the yScoll
			// change top of contentWrapper
			contentWrapper.style.top = docscroll * -1 + 'px';
			// mac chrome issue:
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			// add modalview class
			$(perspectiveWrapper).addClass('modalview');
			// animate..
			Meteor.setTimeout( function() { $(perspectiveWrapper).addClass('animate'); }, 25 );    }
}
