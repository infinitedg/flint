(function (){
  'use strict';
  Template.core_sensorGrid.events = {
    'click a.sensor-info': function(e, t) {
      e.preventDefault();
      var s = $(t.find('textarea.sensor-info')).val();
      Simulators.update({_id: Flint.getSimulator()._id}, {$set:{sensorText: s}});
    }
  };
  
  Template.core_sensorGrid.sensorText = function() {
    return Flint.getSimulator().sensorText;
  };
  
  Template.core_sensorGrid.created = function() {
    Meteor.defer(function(){
    
      var k;
      var observeLoop;
      var sensorContactAnimationLoop; 
      var sensorContactsCache = {};
    
      k = {
        width: 200,
        height: 200,
        scale: 200 / 600, // Used to determine contact scaling
        strokeWidth: 2,
        color: "00ff00",
        container: $('#core-sensorGrid .sensorgrid-container').get(0),
        spritePath: '/cards/sensorGrid/sprites/',
        shadowInterval: 1000
      };
      k.center = {
        x: k.width / 2,
        y: k.height / 2
      };
      k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;
  
      var stage = new Kinetic.Stage({
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
  
      Flint.Log.verbose('Base grid drawn', 'Sensors');

      // Setup sensor contacts
      var contactsLayer = new Kinetic.Layer();
      var shadowContactsLayer = new Kinetic.Layer();
      
      var addContact = function(contact) {
        if (sensorContactsCache[contact._id] === undefined) {

          // Store the contact in our cache
          sensorContactsCache[contact._id] = contact;

          // Create the visible, draggable contact
          var contactImage = new Image();
          contactImage.onload = function() {
            var image = new Kinetic.Image({
              x: contact.x * k.width,
              y: contact.y * k.height,
              image: contactImage,
              width: 32 * k.scale,
              height: 32 * k.scale,
              draggable: true
            });
            
            image.on('dragend', function(e){
              SensorContacts.update(contact._id, { $set: {x: e.shape.getX() / k.width, y: e.shape.getY() / k.height }});
            });
  
            contactsLayer.add(image).draw();
            sensorContactsCache[contact._id]._sprite = image;
          };
          contactImage.src = k.spritePath + contact.icon;
          
          
          // Create the invisible, shadow contact
          var shadowImage = new Image();
          shadowImage.onload = function() {
            var image = new Kinetic.Image({
              x: contact.x * k.width,
              y: contact.y * k.height,
              image: shadowImage,
              width: 32 * k.scale,
              height: 32 * k.scale
            });
  
            // Make the shadow contact look a little darker
            image.applyFilter(Kinetic.Filters.Brighten, { val: -100 });
            
            shadowContactsLayer.add(image);
            sensorContactsCache[contact._id]._shadowSprite = image;
          };
          shadowImage.src = k.spritePath + contact.icon;
      
          
          Flint.Log.verbose('Added contact ' + contact._id, 'Sensors');
        }
      };
  
      // Add currently available contacts to the simulation
      SensorContacts.find().forEach(addContact);
  
      // Observe changes to collection
      if (observeLoop === undefined) {
        observeLoop = SensorContacts.find().observe({
          added: addContact,
          changed: function(contact, oldContact) {
            Flint.Log.verbose('Changed contact ' + contact._id, 'Sensors');
            var shadowSprite = sensorContactsCache[contact._id]._shadowSprite;
            var sprite = sensorContactsCache[contact._id]._sprite;
            contact._shadowSprite = shadowSprite;
            contact._sprite = sprite;
            sensorContactsCache[contact._id] = contact;
            
            contactsLayer.draw();
          },
          removed: function(contact) {
            Flint.Log.verbose('Removed contact ' + contact._id, 'Sensors');
            sensorContactsCache[contact._id]._shadowSprite.remove();
            sensorContactsCache[contact._id]._sprite.remove();
            delete sensorContactsCache[contact._id];
            contactsLayer.draw();
          }
        });
      }
  
      // For the core, this animation loop runs behind the scenes only when clicked
      sensorContactAnimationLoop = new Kinetic.Animation(function(frame) {
        var dt = frame.timeDiff / 1000; // Change in time between this frame and the prior frame
    
        for (var i in sensorContactsCache) {
          if (sensorContactsCache[i]._shadowSprite === undefined) { // Ignore contacts with undefined sprites - they may be loading
            continue;
          }
      
          var contact = sensorContactsCache[i];
          var sprite = contact._shadowSprite;
          var v = contact.velocity * k.width || 0.01 * k.width; // Defaults to 1/100 grid/second
          var x0 = sprite.getX();
          var y0 = sprite.getY();
          var x  = contact.x * k.width;
          var y  = contact.y * k.height;
      
          if ((x0 === x && y0 === y) || sprite.isDragging()) {
            sensorContactsCache[i].isMoving = false;
            continue;
          }
      
          // First, if the velocity is zero then move the contact there immediately
          sensorContactsCache[i].isMoving = true;
          if (v === 0) {
            sensorContactsCache[i]._shadowSprite.setPosition(x, y);
            continue;
          }
      
          // 1. Calculate the distance in x, y, and direct (h)
          var dx = Math.abs(x - x0); // Distance between current sprite location and intended location on the x-axis
          var dy = Math.abs(y - y0); // Distance between current sprite location and intended location on the y-axis
          var h  = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)); // Distance between current sprite location and intended location (the hypotenuse)
      
          // 2. Calculate angle theta
          var th  = Math.acos(dx / h);

          /** 
            IF the distance between the sprite and its 
            target destination is less than the distance between 
            the sprite and it's planned location,
            THEN set the planned location to its target location
          **/
          var vdt; // Velocity * change in time
          if (v * dt > h) {
            vdt = h;
          } else {
            vdt = v * dt;
          }

          var x1, y1;
          if (x0 - x < 0) {
            x1 = x0 + vdt * Math.cos(th);
          } else {
            x1 = x0 - vdt * Math.cos(th);
          }
      
          if (y0 - y < 0) {
            y1 = y0 + v * dt * Math.sin(th);
          } else {
            y1 = y0 - v * dt * Math.sin(th);
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
          sensorContactsCache[i]._shadowSprite.setPosition(x1, y1);
        }
      }, shadowContactsLayer);
  
      // add the layer to the stage
      stage.add(backdrop);
      stage.add(shadowContactsLayer);
      stage.add(contactsLayer);
      
      // Hide the shadowContactsLayer
      shadowContactsLayer.hide();
  
      Flint.Log.verbose('Layers attached to stage', 'Sensors');
  
      // Start our animations
      sensorContactAnimationLoop.start();
      Flint.Log.verbose('Animation loop started', 'Sensors');
      
      // Display shadowContacts for k.shadowInterval when we click the black grid
      backdrop.on('click tap', function(e) {
        if (!shadowContactsLayer.isVisible()) {
          Flint.Log.verbose("Shadow contacts revealed", "Sensors");
          shadowContactsLayer.show();
          Meteor.setTimeout(function(){
            Flint.Log.verbose("Shadow contacts concealed", "Sensors");
            shadowContactsLayer.hide();
          }, k.shadowInterval);
        }
      });
            
    });
  };
}());
