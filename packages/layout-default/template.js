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

// /**
// Constant speed for transitioning between cards
// @property transitionSpeed
// @type Number
// @default 200
// */
// Template.layout_default.transitionSpeed = 200;
// 
// // @TODO: Consider moving these to being variables on "this"
// var cardTransitionAutorun, stationActionObserver;

/**
Setup card transitions and handle remote functions like flashing or resetting the client.
When the current station's document changes, it will trigger certain events on the client.
We may refactor this behavior into a more reusable package with an invisible template,
implemented similarly or through [meteor-streams](https://atmosphere.meteor.com/package/streams).

Most importantly, this will also play the "sciences.wav" sound effect for old times' sake.
@method created
*/
// Template.layout_default.created = function() {
//   cardTransitionAutorun = Deps.autorun(function() {
//     if ('card-' + Flint.cardId() !== $('div.card:visible').attr('id')) {
//       $('div.card:visible').fadeOut(Template.layout_default.transitionSpeed, function() {
//         $('div.card#card-' + Flint.cardId()).fadeIn(Template.layout_default.transitionSpeed);
//       });
//     } else {
//       $('div.card').not('#card-' + Flint.cardId()).hide();
//       $('div.card#card-' + Flint.cardId()).show();
//     }
//   });
//   
//   // Watch the remoteAction and remoteActionSeed fields of the station object, trigger events when they change
//   stationActionObserver = Flint.stations.find(Flint.stationId()).observeChanges({
//     changed: function(id, fields) {
//       if (fields.remoteActionSeed !== undefined) { // We always expect a different remoteActionSeed to trigger an event
//         var action = fields.remoteAction;
//         var options = fields.remoteActionOptions;
//         if (action === undefined) { // If the seed was updated but the event was not, retrieve the event
//           action = Flint.station().remoteAction;
//         }
//         if (options === undefined) {
//           options = Flint.station().remoteActionOptions;
//         }
//         
//         // Check to see if we are the intended participant
//         if (options.clientId !== undefined && options.clientId !== Flint.clientId()) {
//           return; // Ignore message
//         }
//         
//         // Implement actions here
//         if (action === 'flash') {
//           Flint.flash();
//         } else if (action === 'reselect') {
//           Flint.resetClient();
//         }
//       }
//     }
//   });
//   
//   // For old times' sake :)
//   Flint.play('sciences.wav');
// };
// 
// /**
// When rendered, perform some magic to properly manage card transitions using dependencies
// @method rendered
// */
// Template.layout_default.rendered = function() {
//   if (!$('div.card:visible')) {
//     $('div.card:first').show();
//     $('div.card').not(':first').hide();
//   } else {
//     cardTransitionAutorun.invalidate();
//   }
// };
// 
// /**
// Cleanup dependencies
// @method destroyed
// */
// Template.layout_default.destroyed = function() {
//   cardTransitionAutorun.stop();
//   stationActionObserver.stop();
// };
Template.layout_default.alertCondition = function() {
  var a = Flint.simulator().alertCondition;
  return a;
};

Template.layout_default.alertColor = function() {
    var a = Flint.simulator().alertCondition;
  switch (a) {
  case 'c':
  case 'cloak':
  case 'purple':
    return '#5C3D70';
  case 5:
    return '#304e66';
  case 4:
    return '#304e66';
  case 3:
    return '#70683D';
  case 2:
    return '#705C3D';
  case 1:
    return '#703D3D';
  }
}
Template.layout_default.simulator = function() {
  return Flint.simulator();
}

Template.layout_default.station = function() {
  return Flint.station();
}
Template.layout_default.cardName = function() {
    return Flint.card().name;   
}
Template.layout_default.created = function() {
	//Flint.play('sciences');
}

//Gives the EnderLayout color classes for different alert levels
Template.layout_default.alertLevel = function() {
  var a = Flint.simulator().alertCondition;
  switch (a) {
  case 'c':
  case 'cloak':
  case 'purple':
    return 'cloakColor';
  case 5:
    return 'nominalColor';
  case 4:
    return 'attentionColor';
  case 3:
    return 'cautionColor';
  case 2:
    return 'warningColor';
  case 1:
    return 'dangerColor';
  }
    
}

Template.layout_default.events = {
  'click div.pageContent': function(e, context) {
           if ($('.animate').length > 0) {
              var showMenu = document.getElementById( 'showMenu' ),
			 perspectiveWrapper = document.getElementById( 'perspective' ),
			 container = perspectiveWrapper.querySelector( '.pageContent' ),
			 contentWrapper = container.querySelector( '.wrapper' );
        
            $(perspectiveWrapper).removeClass('animate');
            Meteor.setTimeout( function() { $(perspectiveWrapper).removeClass('modalview'); }, 400);
               
           }
      
  },

  'click div.sim-name': function(e, context) {
            if (Flint.client().name){
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
            },
}