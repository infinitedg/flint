/**
@module Templates
@submodule Cards
*/

var contactsLayer = new Kinetic.Layer();

var k = {
  width: 500,
  height: 500,
  scale: 1, // Used to determine the sizing of contacts
  strokeWidth: 2,
  color: "00ff00",
  spritePath: '/packages/card-sensorGrid/sprites/',
  filter: {
    red: 0,
    green: 255,
    blue: 0
  },
}, 
contactsArray = {};

k.center = {
  x: k.width / 2,
  y: k.height / 2
};

k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;

function transformX(x) {
  return Math.round(k.width * ((x * 1) + 1) / 2); // Translate and scale to different coordinate system
}

function transformY(y) {
  return Math.round(k.height * ((y * 1) + 1) / 2); // Flip, translate, and scale to different coordinate system
}

/**
Standard sensor grid card for sensors stations
@class card_sensorGrid
*/
Template.card_sensorGrid.created = function() {
  this.subscription = Deps.autorun(function() {
    Meteor.subscribe('cards.card-sensorGrid.contacts', Flint.simulatorId());
  });

  // contactsLayer = new Kinetic.Layer();

  this.sensorObserver = Flint.collection('sensorContacts').find({simulatorId: Flint.simulatorId()}).observeChanges({
    added: function(id, doc) {
      if (!contactsArray[id]) {
        // console.log("Added", id, doc);
        var imageObj = new Image();
        imageObj.onload = function() {
          var icon = new Kinetic.Image({
            x: transformX(doc.x),
            y: transformY(doc.z),
            image: imageObj,
            width: 30,
            height: 30,
            red: k.filter.red,
            green: k.filter.green,
            blue: k.filter.blue
          });
          icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);

          // add the shape to the layer
          contactsLayer.add(icon);
          icon.cache();
          icon.draw();
          icon.visible(doc.isVisible);
          contactsArray[id] = icon;
        };
        imageObj.src = Flint.a('/Sensor Icons/' + doc.icon);
      }
    },
    changed: function(id, fields) {
      // console.log("Changed", id, fields);
      var icon = contactsArray[id];
      if (icon) {
        if (fields.x !== undefined) {
          icon.setX(transformX(fields.x));
        }
        if (fields.z !== undefined) {
          icon.setY(transformY(fields.z));
        }

        if (fields.isVisible !== undefined) {
          icon.visible(fields.isVisible);
        }
        contactsLayer.draw();
      }
    },
    removed: function(id) {
      // console.log("Removed", id);
      contactsArray[id].remove();
      contactsLayer.draw();
    }
  });
};

/**
Setup dependencies and observation loop for animating sensor contacts
@method rendered
*/
Template.card_sensorGrid.rendered = function() {
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

  var blackBack = new Kinetic.Circle(_.extend({}, circlePrototype, {fill: 'black'}));
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
  stage.add(contactsLayer);
};

Template.card_sensorGrid.destroyed = function() {
  this.sensorObserver.stop();
  this.subscription.stop();
};
