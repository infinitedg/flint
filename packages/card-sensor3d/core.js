/**
@module Templates
@submodule Cards
*/

var contactsLayer = new Kinetic.Layer();
var ghostLayer = new Kinetic.Layer();
window.currentDimensions = {
  x: 'x',
  y: 'z',
  flippedX: 1,
  flippedY: 1
};

var k = {
  width: 250,
  height: 250,
  scale: 0.3, // Used to determine the sizing of contacts
  strokeWidth: 2,
  color: "00ff00",
  filter: {
    red: 0,
    green: 255,
    blue: 0
  },
  spritePath: '/packages/card-sensorGrid/sprites/'
};
window.contactsArray = {};

k.center = {
  x: k.width / 2,
  y: k.height / 2
};

k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;

function transformX(x) {
  return k.width * ((x * currentDimensions.flippedX) + 1) / 2; // Translate and scale to different coordinate system
};

function transformY(y) {
  return k.height * ((y * currentDimensions.flippedY) + 1) / 2; // Flip, translate, and scale to different coordinate system
};

/**
Standard sensor grid card for sensors stations
@class core_sensor3d
*/
Template.core_sensor3d.created = function() {
  this.subscription = Deps.autorun(function() {
    Meteor.subscribe('cards.card-sensorGrid.contacts', Flint.simulatorId());
  });

  // contactsLayer = new Kinetic.Layer();

  this.sensorObserver = Flint.collection('sensorContacts').find({simulatorId: Flint.simulatorId()}).observeChanges({
    added: function(id, doc) {
      // console.log("Added", id, doc);
      if (!contactsArray[id]) {
        contactsArray[id] = {};

        // Draggable Contact
        var contactObj = new Image();
        contactObj.onload = function() {
          var icon = new Kinetic.Image({
            x: transformX(doc['dst' + currentDimensions.x.toUpperCase()]),
            y: transformY(doc['dst' + currentDimensions.y.toUpperCase()]),
            image: contactObj,
            width: 50 * k.scale,
            height: 50 * k.scale,
            draggable: true,
            red: k.filter.red,
            green: k.filter.green,
            blue: k.filter.blue
          });

          // Setup filters
          icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);

          // Dragging handler
          icon.on('dragend', function(evt) {
            var x = ( currentDimensions.flippedX * 2 * (this.getX()) / k.width) + 1 * currentDimensions.flippedX * -1,
                y = ( currentDimensions.flippedY * 2 * (this.getY()) / k.height) + 1 * currentDimensions.flippedY * -1,
            updateObj = {isMoving: true};
            updateObj['dst'+ currentDimensions.x.toUpperCase()] = x;
            updateObj['dst' + currentDimensions.y.toUpperCase()] = y;
            Flint.collection('sensorContacts').update(id, {$set: updateObj});
          });

          // add the shape to the layer
          contactsLayer.add(icon);
          icon.cache();
          icon.draw();
          contactsArray[id].contact = icon;
        };
        contactObj.src = k.spritePath + doc.icon;

        // Ghost Contact
        var ghostObj = new Image();
        ghostObj.onload = function() {
          var icon = new Kinetic.Image({
            x: transformX(doc[currentDimensions.x]),
            y: transformY(doc[currentDimensions.y]),
            image: ghostObj,
            width: 50 * k.scale,
            height: 50 * k.scale,
            opacity: 0.5,
            blurRadius: 2,
            red: k.filter.red,
            green: k.filter.green,
            blue: k.filter.blue
          });
          icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.Blur]);

          // add the shape to the layer
          ghostLayer.add(icon);
          icon.cache();
          icon.draw();
          contactsArray[id].ghost = icon;
        };
        ghostObj.src = k.spritePath + doc.icon;
      }
    },
    changed: function(id, fields) {
      // console.log("Changed", id, fields);
      var contact = contactsArray[id].contact,
            ghost = contactsArray[id].ghost;
      if (contact && ghost) {
        if (fields[currentDimensions.x] !== undefined) {
          ghost.setX(transformX(fields[currentDimensions.x]));
        }
        if (fields[currentDimensions.y] !== undefined) {
          ghost.setY(transformY(fields[currentDimensions.y]));
        }

        if (fields['dst' + currentDimensions.x.toUpperCase()] !== undefined) {
          contact.setX(transformX(fields['dst' + currentDimensions.x.toUpperCase()]));
        }
        if (fields['dst' + currentDimensions.y.toUpperCase()] !== undefined) {
          contact.setY(transformY(fields['dst' + currentDimensions.y.toUpperCase()]));
        }

        
        contactsLayer.draw();
        ghostLayer.draw();
      }
    },
    removed: function(id) {
      // console.log("Removed", id);
      contactsArray[id].contact.remove();
      contactsArray[id].ghost.remove();
      delete contactsArray[id];
      contactsLayer.draw();
    }
  });
};

/**
Setup dependencies and observation loop for animating sensor contacts
@method rendered
*/
Template.core_sensor3d.rendered = function() {
  k.container = this.find('.sensorgrid-container');

  var stage = new Kinetic.Stage({
    container: k.container,
    width: k.width,
    height: k.height
  });

  var circlePrototype = {
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: k.radius,
    stroke: k.color,
    strokeWidth: k.strokeWidth
  };

  var blackBack = new Kinetic.Circle(_.extend({}, circlePrototype, {fill: 'black'}))
  var outerCircle = new Kinetic.Circle(_.extend({}, circlePrototype));
  var middleCircle = new Kinetic.Circle(_.extend({}, circlePrototype, {radius: k.radius * 2 / 3}));
  var innerCircle = new Kinetic.Circle(_.extend({}, circlePrototype, {radius: k.radius * 1 / 3}));

  // Draw lines
  var linepoints = function(angle, inverted) {
    // angle in degrees converted to radians
    angle = 2 * Math.PI * angle / 360;
    // x1/y1 point on left
    // x2/y2 point on right
    var x1 = Math.round(k.center.x - k.radius * Math.cos(angle));
    var y1 = Math.round(k.center.y + k.radius * Math.sin(angle));
    var x2 = Math.round(k.center.x + k.radius * Math.cos(angle));
    var y2 = Math.round(k.center.y - k.radius * Math.sin(angle));

    // inverted flips the line across the horizontal axis
    if (inverted) {
      var iy1 = y2;
      var iy2 = y1;
      y1 = iy1;
      y2 = iy2;
    }

    return [x1, y1, x2, y2];
  };

  /// lineHigh a line through the origin terminating on the circle at 75 degrees
  var linePrototype = {
    stroke: k.color,
    strokeWidth: k.strokeWidth,
    lineCap: 'round',
    lineJoin: 'round',
  };

  /// lineMid a line through the origin terminating on the circle at 75 degrees
  var lineHigh = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(75) }));

  /// lineMid a line through the origin terminating on the circle at 45 degrees
  var lineMid = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(45) }));

  /// lineLow a line through the origin terminating on the circle at 15 degrees
  var lineLow = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(15)}));

  /// lineHighInv a line through the origin terminating on the circle at 75 degrees
  var lineHighInv = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(75, true) }));

  /// lineMidInv a line through the origin terminating on the circle at 45 degrees
  var lineMidInv = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(45, true) }));

  /// lineLowInv a line through the origin terminating on the circle at 15 degrees
  var lineLowInv = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(15, true) }));

  // Create backdrop for sensors grid
  var backdrop = new Kinetic.Layer();

  // add the shape to the layer
  backdrop.add(blackBack);

  backdrop.add(lineHigh);
  backdrop.add(lineMid);
  backdrop.add(lineLow);

  backdrop.add(lineHighInv);
  backdrop.add(lineMidInv);
  backdrop.add(lineLowInv);

  backdrop.add(outerCircle);
  backdrop.add(middleCircle);
  backdrop.add(innerCircle);

  Flint.Log.verbose('Base grid drawn', 'Sensors');

  // add the layer to the stage
  stage.add(backdrop);

  Flint.Log.verbose('Layers attached to stage', 'Sensors');
  stage.add(ghostLayer);
  stage.add(contactsLayer);
};

Template.core_sensor3d.destroyed = function() {
  this.sensorObserver.stop();
  this.subscription.stop();
};
