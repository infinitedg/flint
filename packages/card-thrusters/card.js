/**
@module Templates
@submodule Cards
*/
 
/**
Card for manipulating the thrusters. Also shows ship orientation (Yaw, pitch roll).
@class card_thrusters
*/


Template.card_thrusters.events = {
  /**
  Show whether the thruster buttons are being depressed.
  */
  'mousedown div#directional-thrusters': function(e, context) {
    Flint.beep();
    var a = e.target.textContent.toLowerCase();
    Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterDirection: a}});
    e.preventDefault();
  },
  
  'mouseup div#directional-thrusters': function(e, context) {
    Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterDirection: 'none'}});
    e.preventDefault();
  },
  
  'mousedown  div#rotational-thrusters': function(e, context) {
    Flint.beep();
    var a = e.target.textContent.toLowerCase();
                console.log(e);
    var d = e.target.dataset['direction'];
    var a = e.target.dataset['axis'];
    console.log(d);
    int = setInterval(function() {
     
      if (d=="port" || d=="down") {
            $("." + a + "-value").text(parseInt($("." + a + "-value").text()) - 5);
            if (parseInt($("." + a + "-value").text()) < 0) {$("." + a + "-value").text("355");}
      } else if (d="starboard" || d=="up"){
            $("." + a + "-value").text(parseInt($("." + a + "-value").text()) + 5);
            if (parseInt($("." + a + "-value").text()) > 355) {$("." + a + "-value").text("0");}
      }
      Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterRotationYaw: ($('.yaw-value').text())}});
      Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterRotationPitch: ($('.pitch-value').text())}});
      Flint.simulators.update(Flint.simulatorId(), {$set: {thrusterRotationRoll: ($('.roll-value').text())}});
    }, 400);
  },
    
  'mouseup div#rotational-thrusters': function(e, context) {
    clearInterval(int);
    int = null;
  }
};
