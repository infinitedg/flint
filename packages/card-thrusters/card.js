/**
@module Templates
@submodule Cards
*/
var interval;
var convertToRadian = function (degrees) {
    return degrees * (Math.PI / 180);
};
/**
Card for manipulating the thrusters. Also shows ship orientation (Yaw, pitch roll).
@class card_thrusters
*/
Template.card_thrusters.rendered = function () {
    //startOffset();
};
Template.card_thrusters.helpers({
    manualThrustersRequired: function () {
        var requiredThrusters = Flint.simulator('requiredThrusters');
        var currentThrusters = Flint.simulator('thrusterRotation');
        //Long if statement warning//
        if ((requiredThrusters.yaw != currentThrusters.yaw || requiredThrusters.pitch != currentThrusters.pitch || requiredThrusters.roll != currentThrusters.roll) && Flint.simulator('manualThruster') == 'true') {
            return "active";
        } else {
            return '';
        }
    },
    rotationValue: function (which) {
        return Flint.simulator('thrusterRotation')[which];
    },
    requiredValue: function (which) {
        return Flint.simulator('requiredThrusters')[which];
    }
});

Template.card_thrusters.events = {
    /**
  Show whether the thruster buttons are being depressed.
  */
        'mousedown div#directional-thrusters': function (e, context) {
        Flint.beep();
        var a = e.target.textContent.toLowerCase();
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                thrusterDirection: a
            }
        });
        e.preventDefault();
    },

        'mouseup': function (e, context) {
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                thrusterDirection: 'none'
            }
        });
        e.preventDefault();
    },

        'mousedown  div#rotational-thrusters': function (e, context) {
        Flint.beep();
        //var a = e.target.textContent.toLowerCase();
        var d = e.target.dataset.direction;
        var a = e.target.dataset.axis;
        interval = Meteor.setInterval(function () {
            obj = Flint.simulator('thrusterRotation');
            if (d == "port" || d == "down") {
                obj[a] = parseInt(obj[a] - 1,10);
                if (obj[a] < 0) {
                    obj[a] = 359;
                }
            } else if (d == "starboard" || d == "up") {
                obj[a] = parseInt(obj[a] + 1,10);
                if (obj[a] > 359) {
                    obj[a] = 0;
                }
            }
            Flint.simulator('thrusterRotation', obj);

        }, 75);
        $(document).bind('mouseup', function () {
            Meteor.clearInterval(interval);
            interval = null;
        });
        e.preventDefault();
    },

        'mouseup div#rotational-thrusters': function (e, context) {
        Meteor.clearInterval(interval);
        interval = null;
    }
};

function animLoop(render, element) {
    var running, lastFrame = +new Date();

    function loop(now) {
        // stop the loop if render returned false
        if (running !== false) {
            requestAnimationFrame(loop, element);
            running = render(now - lastFrame);
            lastFrame = now;
        }
    }
    loop(lastFrame);
}

var crossX, crossY;
startOffset = function () {
    if (Template.card_thrusters.manualThrustersRequired() == 'active') {
        //thrusterLoop = animLoop(function( deltaT ) {
        var cross = $('.crosshairs');
        if (false) {
            var newX = Math.round(Math.random() * 5) * Math.round((Math.random(3) - 2));
            var newY = Math.round(Math.random() * 5) * Math.round((Math.random(3) - 2));
            TweenLite.to(cross, (Math.random() * 4 + 2), {
                x: (newX + "px"),
                y: (newY + "px"),
                ease: Linear.easeNone,
                onComplete: function () {
                    startOffset();
                }
            });
        } else {
            var currentX = cross.position().left + cross.width();
            var currentY = cross.position().top + cross.height();
            var boxWidth = $('.offset-box').width();
            var boxHeight = $('.offset-box').height();

            crossX = Math.random() * (boxWidth - cross.width()) - boxWidth / 2;
            crossY = Math.random() * (boxHeight - cross.height()) - boxHeight / 2;

            distance = (Math.round(Math.sqrt((crossX - currentX) ^ 2 + (crossY - currentY) ^ 2)));
            TweenLite.to(cross, (distance), {
                x: (crossX + "px"),
                y: (crossY + "px"),
                ease: Linear.easeNone,
                onComplete: function () {
                    startOffset();
                }
            });
        }
        console.log(distance + "%");
        // });
    }
};