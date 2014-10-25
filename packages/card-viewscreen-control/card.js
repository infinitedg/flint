Template.card_viewscreenControl.rendered = function () {
    Draggable.create($("#dragger"), {
        type: "x,y",
        edgeResistance: 0.95,
        onDrag: function () {
            pos = {
                x: this.x + $('.joystick-back').width() / 2,
                y: this.y + $('.joystick-back').height() / 2
            };
            newPos = newPoints(pos);
            newPos.x = (newPos.x - $('.joystick-back').width() / 2);
            newPos.y = (newPos.y - $('.joystick-back').height() / 2);
            transformSet = 'translate3d(' + newPos.x + 'px, ' + newPos.y + 'px, 0px)';
            this.target.style.transform = transformSet;
            
            //Now to calculate the magnitude
            
            magnitude = {x:(newPos.x/($('.joystick-back').width()/2)),y:(newPos.y/($('.joystick-back').height()/2))};
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationYaw: magnitude.x}});
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationPitch: magnitude.y}});
        },
        onDragEnd: function () {
            var joystick = $("#dragger");
            TweenLite.to(joystick, 0.25, {
                transform: 'translate3d(0px,0px,0px)'
            });
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationYaw:0}});
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationPitch: 0}});
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationRoll: 0}});

        }
    });

    Draggable.create($("#rollDragger"), {
        type: "x",
        edgeResistance: 0.95,
        bounds: $(".slider-back"),
        onDrag: function () {
            pos = {
                y: 0,
                x: this.x
            };
            var magnitude = {x: this.x/($('.joystick-back').width()/2)};
           Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationRoll: magnitude.x}});
        },
        onDragEnd: function () {
            var slider = $("#rollDragger");
            TweenLite.to(slider, 0.25, {
                transform: 'translate3d(0px,0px,0px)'
            });
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraRotationRoll: 0}});

        }
    });
    Draggable.create($("#zoomDragger"), {
        type: "y",
        edgeResistance: 0.95,
        bounds: $(".slider-back-vert"),
        onDrag: function () {
            pos = {
                y: this.y,
                x: 0
            };
            var magnitude = {y: this.y/($('.joystick-back').height()/2)};
            console.log(magnitude.y);
           Flint.simulators.update(Flint.simulatorId(), {$set: {cameraZoom: magnitude.y}});
        },
        onDragEnd: function () {
            var slider = $("#zoomDragger");
            TweenLite.to(slider, 0.25, {
                transform: 'translate3d(0px,0px,0px)'
            });
            Flint.simulators.update(Flint.simulatorId(), {$set: {cameraZoom: 0}});

        }
    });

};


Template.card_viewscreenControl.events({

});

function newPoints(pos) {
    var x = $('.joystick-back').width() / 2; // your center point
    var y = $('.joystick-back').height() / 2; // your center point 
    var radius = $('.joystick-back').width() / 2;
    var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)); // distance formula ratio
    if (scale < 1) {
        return {
            y: Math.round((pos.y - y) * scale + y),
            x: Math.round((pos.x - x) * scale + x)

        };
    } else {
        return pos;
    }
}

function distance(location1, location2) {
    return Math.sqrt(Math.pow((location1.x - location2.x), 2) + Math.pow((location1.y - location2.y), 2));

}

function withinCircle(point, radius, circleCenter) {
    //  This is just the standard equation to check if a point is within a circle.  It
    //  is just a glorified distance formula.  vPoint is the point to check, vRadius is
    //  the radius of the circle, and vCircleCenter is the center of the circle.
    //  Thanks Bridger, ;)
    if (!radius) {
        radius = $('.joystick-back').width() / 2;
    }
    if (!circleCenter) {
        circleCenter = {
            x: $('.joystick-back').width() / 2,
            y: $('.joystick-back').height() / 2
        };
    }
    var distanceFromCenter = distance(point, circleCenter);
    if (distanceFromCenter <= radius) {
        return true;
    } else {
        return false;
    }
}


function edgeFinder(location, radius) {
    var xPos = location.x + $('.joystick-back').width() / 2;
    var yPos = location.y + $('.joystick-back').height() / 2;

    if (!radius) {
        radius = $('.joystick-back').width() / 2;
    }

    var r = Math.sqrt(Math.pow(xPos - $('.joystick-back').width() / 2, 2) + Math.pow(yPos - $('.joystick-back').height() / 2, 2));

    var theta = Math.asin((yPos) / r);
    var newLocation = {
        y: 0,
        x: 0
    };
    newLocation.y = radius * Math.sin(theta);
    if (xPos < 0) {
        radius = radius * -1;
    }
    newLocation.x = radius * Math.cos(theta);
    newLocation.x = newLocation.x; // - $('.joystick-back').width()/2;
    newLocation.y = newLocation.y; // - $('.joystick-back').height()/2;
    return newLocation;
}