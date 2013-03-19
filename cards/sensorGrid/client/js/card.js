(function () {
  'use strict';
  
  var k;
  var observeLoop;
  var sensorContactAnimationLoop; // @TODO move back to function scope
  
  window.sensorContacts = {}; // @TODO move back to function scope
  
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
      
      window.stage = new Kinetic.Stage({ // @TODO move back to function scope
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
      var contactsLayer = new Kinetic.Layer();
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
      
        contactsLayer.add(circle);
        contact._sprite = circle;
        sensorContacts[contact._id] = contact;
        
        stage.draw();
      };
      
      // Add currently available contacts to the simulation
      SensorContacts.find().forEach(addContact);
      
      // Observe changes to collection
      if (observeLoop === undefined) {
        observeLoop = SensorContacts.find().observe({
          added: addContact,
          changed: function(contact, oldContact) {
            console.log("changed", contact);
            var sprite = sensorContacts[contact._id]._sprite;
            contact._sprite = sprite;
            sensorContacts[contact._id] = contact;
          },
          removed: function(contact) {
            console.log("removed", contact);
            sensorContacts[contact._id]._sprite.remove();
            delete sensorContacts[contact._id];
            stage.draw();
          }
        });
      }
      
      // 
      var flipper = 0;
      window.sensorContactAnimationLoop = new Kinetic.Animation(function(frame) {
        var dt = frame.timeDiff / 1000; // Change in time between this frame and the prior frame
        
        for (var i in sensorContacts) {
          var contact = sensorContacts[i];
          var sprite = contact._sprite;
          var v = contact.velocity || 5; // Defaults to 1 pixels/second (as a fraction of a grid)
          var x0 = sprite.getX();
          var y0 = sprite.getY();
          var x  = contact.x * k.width;
          var y  = contact.y * k.height;
          
          if (x0 === x && y0 === y) {
            continue;
          }
          
          // First, if the velocity is zero then move the contact there immediately
          if (v === 0) {
            sensorContacts[i]._sprite.setPosition(x, y);
            continue;
          }
          
          // 1. Calculate the distance in x, y, and direct (h)
          var dx = Math.abs(x - x0); // Distance between current sprite location and intended location on the x-axis
          var dy = Math.abs(y - y0); // Distance between current sprite location and intended location on the y-axis
          var h  = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)); // Distance between current sprite location and intended location (the hypotenuse)
          
          // 2. Calculate angle theta
          var th  = Math.acos(dx / h);

          var x1, y1;
          if (x0 / k.width > 0.5) {
            x1 = x0 - v * dt * Math.cos(th);
          } else {
            x1 = x0 + v * dt * Math.cos(th);
          }
          
          if (y0 / k.height > 0.5) {
            y1 = y0 - v * dt * Math.sin(th);
          } else {
            y1 = y0 + v * dt * Math.sin(th);
          }
          
          // If the difference between the new point and the target point is within our threshhold, then set it to the new location
          var threshhold = 0.2;
          if (Math.abs(x1-x) < threshhold) {
            x1 = x;
          }
          if (Math.abs(y1-y) < threshhold) {
            y1 = y;
          }
          
          // 3. Set the location of this sprite to the new location
          sensorContacts[i]._sprite.setPosition(x1, y1);
        }
        if (window.sensorContactAnimationLoop !== undefined && flipper !== 0) {
          // window.sensorContactAnimationLoop.stop();
          flipper = 0;
        } else {
          flipper = 1;
        }
        
      }, contactsLayer);
      
      // add the layer to the stage
      stage.add(backdrop);
      stage.add(contactsLayer);
      
      // Start our animations
      window.sensorContactAnimationLoop.start();
      
    });
  };
}());
