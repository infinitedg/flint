(function () {
  'use strict';
  
  var k;
  var observeLoop;
  window.sensorContacts = {};
  
  Template.card_sensorGrid.sensorInfo = function() {
    return Flint.getSimulator().sensorText;
  };
  
  Template.card_sensorGrid.rendered = function() {
    Meteor.defer(function(){
      
      k = {
        width: 600,
        height: 600,
        strokeWidth: 2,
        color: "00ff00",
        container: $('#card-sensorGrid .sensorgrid-container').get(0)
      };
      k.center = {
        x: k.width / 2,
        y: k.height / 2
      };
      k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;
      
      window.stage = new Kinetic.Stage({
        container: k.container,
        width: k.width,
        height: k.height
      });

      var outerCircle = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: k.radius,
        fill: 'black',
        stroke: k.color,
        strokeWidth: k.strokeWidth
      });
    
      var middleCircle = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: k.radius * 2 / 3,
        stroke: k.color,
        strokeWidth: k.strokeWidth
      });
    
      var innerCircle = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: k.radius * 1 / 3,
        stroke: k.color,
        strokeWidth: k.strokeWidth
      });
    
      // Draw lines
      var linepoints = function(angle, inverted) {
        // angle in degrees converted to radians
        angle = 2 * Math.PI * angle / 360;
        // x1/y1 point on left
        // x2/y2 point on right
        var x1 = k.center.x - k.radius * Math.cos(angle);
        var y1 = k.center.y + k.radius * Math.sin(angle);
        var x2 = k.center.x + k.radius * Math.cos(angle);
        var y2 = k.center.y - k.radius * Math.sin(angle);
      
        // inverted flips the line across the horizontal axis
        if (inverted) {
          var iy1 = y2;
          var iy2 = y1;
          y1 = iy1;
          y2 = iy2;
        }
        return [[x1, y1], [x2, y2]];
      };
   
      /// lineHigh a line through the origin terminating on the circle at 75 degrees
      var linePrototype = {
        stroke: k.color,
        strokeWidth: k.strokeWidth,
        lineCap: 'round',
        lineJoin: 'round'
      };
      
      var lineHigh = new Kinetic.Line(_.extend(linePrototype, {points: linepoints(75)}));
    
      /// lineMid a line through the origin terminating on the circle at 45 degrees
      var lineMid = new Kinetic.Line(_.extend(linePrototype, {points: linepoints(45)}));
    
      /// lineLow a line through the origin terminating on the circle at 15 degrees
      var lineLow = new Kinetic.Line(_.extend(linePrototype, {points: linepoints(15)}));
    
      /// lineHighInv a line through the origin terminating on the circle at 75 degrees
      var lineHighInv = new Kinetic.Line(_.extend(linePrototype, {points: linepoints(75, true)}));
    
      /// lineMidInv a line through the origin terminating on the circle at 45 degrees
      var lineMidInv = new Kinetic.Line(_.extend(linePrototype, {points: linepoints(45, true)}));

      /// lineLowInv a line through the origin terminating on the circle at 15 degrees
      var lineLowInv = new Kinetic.Line(_.extend(linePrototype, {points: linepoints(15, true)}));
    
      // Create backdrop for sensors grid
      var backdrop = new Kinetic.Layer();
    
      // add the shape to the layer
      backdrop.add(outerCircle);
      backdrop.add(middleCircle);
      backdrop.add(innerCircle);
    
      backdrop.add(lineHigh);
      backdrop.add(lineMid);
      backdrop.add(lineLow);
    
      backdrop.add(lineHighInv);
      backdrop.add(lineMidInv);
      backdrop.add(lineLowInv);
    
      // Setup sensor contacts
      var addContact = function(contact) {
        console.log('added',contact);
        var circle = new Kinetic.Circle({
          x: contact.x * k.width,
          y: contact.y * k.height,
          radius: 20,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4
        });
      
        backdrop.add(circle);
        contact._sprite = circle;
        sensorContacts[contact._id] = contact;
        
        stage.draw();
      };
      
      // Add currently available contacts to the simulation
      SensorContacts.find().forEach(addContact);
      
      // Observe changes to collection
      var contactsLayer = new Kinetic.Layer();
      if (observeLoop === undefined) {
        observeLoop = SensorContacts.find().observe({
          added: addContact,
          changed: function(contact, oldContact) {
            console.log("changed", contact);
            var sprite = sensorContacts[contact._id]._sprite;
            sprite.setPosition(contact.x * k.width, contact.y * k.height);
            contact._sprite = sprite;
            sensorContacts[contact._id] = contact;
            stage.draw();
          },
          removed: function(contact) {
            console.log("removed", contact);
            sensorContacts[contact._id]._sprite.remove();
            delete sensorContacts[contact._id];
            stage.draw();
          }
        });
      }
      
      // add the layer to the stage
      stage.add(backdrop);
      // stage.add(contactsLayer);
      
    });
  };
}());
