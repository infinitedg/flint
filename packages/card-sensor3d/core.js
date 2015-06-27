/**
@module Templates
@submodule Cards
*/

currentDimensions = {
  x: 'x',
  y: 'z',
  flippedX: 1,
  flippedY: 1,
  otherDimension: function () { // Returns the dimension currently not being viewed
    var dims = {
      x: this.x === 'x' || this.y === 'y',
      y: this.x === 'y' || this.y === 'y',
      z: this.x === 'z' || this.y === 'z'
    };
    if (!dims.x) {
      return 'x';
    } else if (!dims.y) {
      return 'y';
    } else if (!dims.z) {
      return 'z';
    }
  }
};
currentDimensions.otherDimension = function () { // Returns the dimension currently not being viewed
  var dims = {
    x: this.x === 'x' || this.y === 'y',
    y: this.x === 'y' || this.y === 'y',
    z: this.x === 'z' || this.y === 'z'
  };
  if (!dims.x) {
    return 'x';
  } else if (!dims.y) {
    return 'y';
  } else if (!dims.z) {
    return 'z';
  }
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

var contactsArray = {};
var armyArray = {};

k.center = {
  x: k.width / 2,
  y: k.height / 2
};

k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;

function transformX(x) {
  return k.width * ((x * currentDimensions.flippedX) + 1) / 2; // Translate and scale to different coordinate system
}

function transformY(y) {
  return k.height * ((y * currentDimensions.flippedY) + 1) / 2; // Flip, translate, and scale to different coordinate system
}

Template.core_sensor3d.helpers({
  listOfIcons: function () {
    return iconList();
  },
  wormhole: function () {
    return Flint.system('Sensors','wormhole');
  },
  buttonLabel: function () {
    if (Session.get('currentDimension') === 'z') {
      return 'Viewing From Top';
    } else {
      return 'Viewing From Side';
    }
  }
});

function changeIcon(icon, id) {
  id = Session.get('currentSensorIcon');
  if (id.kind == 'army') {
    Flint.collection('armyContacts').update(id.which, {
      $set: {
        icon: icon
      }
    });
  } else if (id.kind == 'grid') {
    Flint.collection('sensorContacts').update(id.which, {
      $set: {
        icon: icon
      }
    });
  }
}

function changePicture(icon, id) {
  id = Session.get('currentSensorIcon');
  if (id.kind == 'army') {
    Flint.collection('armyContacts').update(id.which, {
      $set: {
        picture: icon
      }
    });
  } else if (id.kind == 'grid') {
    Flint.collection('sensorContacts').update(id.which, {
      $set: {
        picture: icon
      }
    });
  }
}

function changeModel(model, id) {
  id = Session.get('currentSensorIcon');
  if (id.kind == 'army') {
    Flint.collection('armyContacts').update(id.which, {
      $set: {
        mesh: model
      }
    });
  } else if (id.kind == 'grid') {
    Flint.collection('sensorContacts').update(id.which, {
      $set: {
        mesh: model
      }
    });
  }
}

function changeLabel(id) {
  var contact = Flint.collection('sensorContacts').findOne(id);
  var newLabel = prompt("Please enter the new label", contact.name);
  Flint.collection('sensorContacts').update(id, {
    $set: {
      name: newLabel
    }
  });
}

function changeIFF(iff) {
  var id = Session.get('currentSensorIcon');
  var color;
  switch (iff) {
    case 'Friendly':
    color = "#07f";
    break;
    case 'Neutral':
    color = "#ff0";
    break;
    case 'Foe':
    color = "#f00";
    break;
    case 'Unknown':
    color = "#aaa";
    break;
  }
  if (id.kind == 'army') {
    Flint.collection('armyContacts').update(id.which, {
      $set: {
        color: color
      }
    });
  } else if (id.kind == 'grid') {
    Flint.collection('sensorContacts').update(id.which, {
      $set: {
        color: color
      }
    });
  }
}
iconList = function () {
  var sel = {};
  var iconList = [];
  var folderList = Flint.Asset.listFolder('/Sensor Icons');
  folderList.containers.forEach(function(e){
    iconList.push({
      text: e.name,
      action: function (e) {
        changeIcon(e.target.text);
      }
    });
  });
  return iconList;
};
pictureList = function () {
  var sel = {},
  pictureList = [];
  var folderList = Flint.Asset.listFolder('/Sensor Pictures');
  folderList.containers.forEach(function(e){
    pictureList.push({
      text: e.name,
      action: function (e) {
        changePicture(e.target.text);
      }
    });
  });
  return pictureList;
};
modelList = function () {
  var sel = {};
  var iconList = [];
  var folderList = Flint.Asset.listFolder('/Sandbox Models');
  folderList.containers.forEach(function(e){
    iconList.push({
      text: e.name,
      action: function (e) {
        changeModel(e.target.text);
      }
    });
  });
  return iconList;
};
iffList = function () {
  var iffList = [];
  iffList.push({
    text: "Friendly",
    action: function (e) {
      changeIFF(e.target.text);
    }
  });
  iffList.push({
    text: "Neutral",
    action: function (e) {
      changeIFF(e.target.text);
    }
  });
  iffList.push({
    text: "Foe",
    action: function (e) {
      changeIFF(e.target.text);
    }
  });
  iffList.push({
    text: "Unknown",
    action: function (e) {
      changeIFF(e.target.text);
    }
  });
  return iffList;
};
var contactsLayer = new Kinetic.Layer();
var ghostLayer = new Kinetic.Layer();
var armyLayer = new Kinetic.Layer({
  x: k.width + 30,
  y: 0
});

/**
Standard sensor grid card for sensors stations
@class core_sensor3d
*/
Template.core_sensor3d.created = function () {
  Session.set('currentDimension', currentDimensions.y);

  this.subscription = Deps.autorun(function () {
    Meteor.subscribe('cards.core-sensor3d.contacts', Flint.simulatorId());
    Meteor.subscribe('cards.core-sensor3d.armies', Flint.simulatorId());
    Meteor.subscribe("flint.assets.objects.all");
    Meteor.subscribe("flint.assets.containers.all");
    Meteor.subscribe("flint.assets.folders.all");
  });
  context.init({
    compact: true
  });
  this.sensorObserver = Flint.collection('sensorContacts').find().observeChanges({
    added: function (id, doc) {
      // console.log("Added", id, doc);
      if (!contactsArray[id]) {
        contactsArray[id] = {};
        //Create the draggable contact
        var contactsContainer = d3.select('#gridContacts');
        var contactInfo = contactsContainer.append('li');
        var contactIcon = contactInfo.append('img').attr('src', Flint.a('/Sensor Icons/' + doc.icon));
        contactIcon.attr('height', 50 * k.scale);
        contactInfo.attr('id', ('contact-' + id));
        contactInfo.attr('title', id);
        var icon = $("#contact-" + id);
        var transformation = (transformX(doc['dst' + currentDimensions.x.toUpperCase()]) + "px, " + transformY(doc['dst' + currentDimensions.y.toUpperCase()]) + "px, 0px");
        TweenLite.to(icon, 0.0, {
          transform: 'translate3d(' + transformation + ')'
        });
        var contextArray = [{
          header: 'Icon'
        }, {
          text: 'Change Label',
          action: function (e) {
            changeLabel(id);
          }
        }, {
          text: 'Icons',
          subMenu: iconList()
        }, {
          text: 'Pictures',
          subMenu: pictureList()
        }, {
          text: 'Models',
          subMenu: modelList()
        }, {
          divider: true
        }, {
          text: 'IFF',
          subMenu: iffList()
        }, {
          text: 'Behaviors'
        }];
        context.attach(('#contact-' + id), contextArray);
        Draggable.create($("#contact-" + id), {
          edgeResistance: 0.5,
          bounds: $("#coreSensor3d"),
          onDragEnd: function () {
            var x = (currentDimensions.flippedX * 2 * (this.x - this.minX) / k.width) + 1 * currentDimensions.flippedX * -1,
            y = (currentDimensions.flippedY * 2 * (this.y - this.minY) / k.height) + 1 * currentDimensions.flippedY * -1,
            z = 0,
            updateObj = {
              isMoving: true
            },
            d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
            if (d > 1.2) {
              Flint.collection('sensorContacts').remove(id);
            } else {
              updateObj['dst' + currentDimensions.x.toUpperCase()] = x;
              updateObj['dst' + currentDimensions.y.toUpperCase()] = y;
              updateObj.velocity = $('#speedSelect').val();
              Flint.collection('sensorContacts').update(id, {
                $set: updateObj
              });
            }
          }
        });
        contactsArray[id].contact = contactInfo;

        /*// Draggable Contact
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
  contactObj.src = Flint.a('/Sensor Icons/' + doc.icon);
  */
  // Ghost Contact
  var ghostObj = new Image();
  ghostObj.onload = function () {
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
  ghostObj.src = Flint.a('/Sensor Icons/' + doc.icon);
}
},
changed: function (id, fields) {
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
      //  contact.setX(transformX(fields['dst' + currentDimensions.x.toUpperCase()]));
    }
    if (fields['dst' + currentDimensions.y.toUpperCase()] !== undefined) {
      //  contact.setY(transformY(fields['dst' + currentDimensions.y.toUpperCase()]));
    }
    if (fields.icon !== undefined) {
      $('#contact-' + id + ' img').attr('src', Flint.a('/Sensor Icons/' + fields.icon));

      var ghostObj = new Image();
      ghostObj.onload = function () {
        ghost.setImage(ghostObj);
        ghost.cache();
        ghost.draw();
      };
      ghostObj.src = Flint.a('/Sensor Icons/' + fields.icon);
    }

    //  contactsLayer.draw();
    ghostLayer.draw();
  }
},
removed: function (id) {
  // console.log("Removed", id);
  contactsArray[id].contact.remove();
  contactsArray[id].ghost.remove();
  delete contactsArray[id];
  contactsLayer.draw();
  ghostLayer.draw();
}
});
this.armyObserver = Flint.collection('armyContacts').find().observe({
  addedAt: function (doc, atIndex) {
    var id = doc._id;
    if (!armyArray[id]) {
      armyArray[id] = {};
      //Create the draggable contact
      var contactsContainer = d3.select('#sensorContacts');
      var contactInfo = contactsContainer.append('li');
      var contactLabel = contactInfo.append('input').attr('type', 'text');
      var contactIcon = contactInfo.append('img').attr('src', Flint.a('/Sensor Icons/' + doc.icon));
      var infaredIcon = contactInfo.append('input').attr('type', 'checkbox').attr('checked', doc.infared);
      var iffOverlay = contactIcon.append('div').attr('class', 'sensorIFFOverlay');
      contactIcon.attr('height', 50 * k.scale);
      contactLabel.attr('class', 'form-control');
      contactLabel.attr('value', doc.name);
      contactInfo.attr('id', ('contact-' + atIndex));
      contactInfo.attr('title', id);
      $('#contact-' + atIndex + " .sensorIFFOverlay").css('background-color', doc.color);
      var contextArray = [{
        header: 'Icon'
      }, {
        text: 'Icons',
        subMenu: iconList()
      }, {
        text: 'Pictures',
        subMenu: pictureList()
      }, {
        text: 'Models',
        subMenu: modelList()
      }, {
        divider: true
      }, {
        text: 'IFF',
        subMenu: iffList()
      }, {
        text: 'Behaviors'
      }];
      context.attach(('#contact-' + atIndex), contextArray);
      Draggable.create($("#contact-" + atIndex + " img"), {
        edgeResistance: 0.5,
        bounds: $("#coreSensor3d"),
        onDrag: function () {

        },
        onDragEnd: function () {
          var cTmpl = Flint.collection('armyContacts').findOne(id);
          var x = (currentDimensions.flippedX * 2 * (this.x - this.minX) / k.width) + 1 * currentDimensions.flippedX * -1,
          y = (currentDimensions.flippedY * 2 * (this.y - this.minY) / k.height) + 1 * currentDimensions.flippedY * -1,
          z = 0,
          d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
          if (d < 1.2) { // Only drop the contact if we are within 120% of the grid's radius
          var updateObj = _.extend(cTmpl, {
            isMoving: true,
            isVisible: true,
            velocity: 0.05
          });
          updateObj['dst' + currentDimensions.x.toUpperCase()] = x;
          updateObj['dst' + currentDimensions.y.toUpperCase()] = y;
          updateObj['dst' + currentDimensions.otherDimension().toUpperCase()] = z;
          updateObj[currentDimensions.x] = x;
          updateObj[currentDimensions.y] = y;
          updateObj[currentDimensions.otherDimension()] = z;
          updateObj.velocity = $('#speedSelect').val();
          delete updateObj._id;
          Flint.collection('sensorContacts').insert(updateObj);
        }
        // Move back to the origin
        var icon = $("#contact-" + atIndex + " img");
        TweenLite.to(icon, 0.0, {
          transform: 'translate3d(0px,0px,0px)'
        });
      }
    });
    armyArray[id].contact = contactInfo;
  }

},
changedAt: function (doc, oldDoc, atIndex) {
  $('#contact-' + atIndex + ' img').attr('src', Flint.a('/Sensor Icons/' + doc.icon));
}

});
/*this.armyObserver = Flint.collection('armyContacts').find().observe({
addedAt: function(doc, atIndex) {
var id = doc._id;
// console.log("Added", id, doc);
if (!armyArray[id]) {
armyArray[id] = {};

// Draggable Contact
var contactObj = new Image();
contactObj.onload = function() {
var icon = new Kinetic.Image({
x: 0,
y: atIndex * (50 * k.scale + 5),
image: contactObj,
width: 50 * k.scale,
height: 50 * k.scale,
draggable: true,
red: 242,
green: 174,
blue: 67
});

// Setup filters
icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);

// Dragging handler
icon.on('dragend', function(evt) {
var cTmpl = Flint.collection('armyContacts').findOne(id);
var x = ( currentDimensions.flippedX * 2 * (this.getX() + k.width + 30) / k.width) + 1 * currentDimensions.flippedX * -1,
y = ( currentDimensions.flippedY * 2 * (this.getY()) / k.height) + 1 * currentDimensions.flippedY * -1,
z = 0,
d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
if (d < 1.2) { // Only drop the contact if we are within 120% of the grid's radius
var updateObj = _.extend(cTmpl, {isMoving: true, isVisible: true, mesh: 'AstraShuttle', velocity: 0.05});
updateObj['dst'+ currentDimensions.x.toUpperCase()] = x;
updateObj['dst' + currentDimensions.y.toUpperCase()] = y;
updateObj['dst' + currentDimensions.otherDimension().toUpperCase()] = z;
updateObj[currentDimensions.x] = x;
updateObj[currentDimensions.y] = y;
updateObj[currentDimensions.otherDimension()] = z;
delete updateObj['_id'];
Flint.collection('sensorContacts').insert(updateObj);
}
// Move back to the origin
this.setX(0);
this.setY(atIndex * (50 * k.scale + 5));
armyLayer.draw();
});
icon.on('mousedown', function(evt){
console.log(evt);
if (evt.evt.button == 2) {
alert('rightclick');
var node = evt.targetNode;
console.log(node);
}
evt.evt.preventDefault();
return false();
});
icon.on('mouseup', function(evt){
evt.evt.preventDefault();
});
icon.on('contextmenu', function(evt){
evt.evt.preventDefault();
});
// add the shape to the layer
armyLayer.add(icon);
icon.cache();
icon.draw();
armyArray[id].contact = icon;
};
contactObj.src = k.spritePath + doc.icon;
}
},
changedAt: function(id, fields) {
// Update kinetic image properties
},
removedAt: function(id) {

}
})*/
};

/**
Setup dependencies and observation loop for animating sensor contacts
@method rendered
*/
Template.core_sensor3d.rendered = function () {
  k.container = this.find('.sensorgrid-container');

  var stage = new Kinetic.Stage({
    container: k.container,
    width: k.width + 30 + 50 * k.scale, // Provide room for 30 pixel margin between grid and army contacts, plus contact size.
    height: k.height
  });

  var circlePrototype = {
    x: k.width / 2,
    y: k.height / 2,
    radius: k.radius,
    stroke: k.color,
    strokeWidth: k.strokeWidth
  };

  var blackBack = new Kinetic.Circle(_.extend({}, circlePrototype, {
    fill: 'black'
  }));
  var outerCircle = new Kinetic.Circle(_.extend({}, circlePrototype));
  var middleCircle = new Kinetic.Circle(_.extend({}, circlePrototype, {
    radius: k.radius * 2 / 3
  }));
  var innerCircle = new Kinetic.Circle(_.extend({}, circlePrototype, {
    radius: k.radius * 1 / 3
  }));

  // Draw lines
  var linepoints = function (angle, inverted) {
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
    lineJoin: 'round'
  };

  /// lineMid a line through the origin terminating on the circle at 75 degrees
  var lineHigh = new Kinetic.Line(_.extend(linePrototype, {
    points: linepoints(75)
  }));

  /// lineMid a line through the origin terminating on the circle at 45 degrees
  var lineMid = new Kinetic.Line(_.extend(linePrototype, {
    points: linepoints(45)
  }));

  /// lineLow a line through the origin terminating on the circle at 15 degrees
  var lineLow = new Kinetic.Line(_.extend(linePrototype, {
    points: linepoints(15)
  }));

  /// lineHighInv a line through the origin terminating on the circle at 75 degrees
  var lineHighInv = new Kinetic.Line(_.extend(linePrototype, {
    points: linepoints(75, true)
  }));

  /// lineMidInv a line through the origin terminating on the circle at 45 degrees
  var lineMidInv = new Kinetic.Line(_.extend(linePrototype, {
    points: linepoints(45, true)
  }));

  /// lineLowInv a line through the origin terminating on the circle at 15 degrees
  var lineLowInv = new Kinetic.Line(_.extend(linePrototype, {
    points: linepoints(15, true)
  }));

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
  stage.add(backdrop); // Lowest layer

  Flint.Log.verbose('Layers attached to stage', 'Sensors');
  stage.add(ghostLayer);
  stage.add(armyLayer);
  stage.add(contactsLayer); // Uppermost layer
};

Template.core_sensor3d.destroyed = function () {
  this.sensorObserver.stop();
  this.armyObserver.stop();
  this.subscription.stop();
};

function refreshGrid() {
  Flint.collection('sensorContacts').find().forEach(function (doc) {
    var icon = $("#contact-" + doc._id);
    var transformation = (transformX(doc['dst' + currentDimensions.x.toUpperCase()]) + "px, " + transformY(doc['dst' + currentDimensions.y.toUpperCase()]) + "px, 0px");
    TweenLite.to(icon, 0.0, {
      transform: 'translate3d(' + transformation + ')'
    });
    // contactsArray[doc._id].contact.setX(transformX(doc['dst' + currentDimensions.x.toUpperCase()]));
    // contactsArray[doc._id].contact.setY(transformY(doc['dst' + currentDimensions.y.toUpperCase()]));
    contactsArray[doc._id].ghost.setX(transformX(doc[currentDimensions.x]));
    contactsArray[doc._id].ghost.setY(transformY(doc[currentDimensions.y]));
  });
  // contactsLayer.draw();
  ghostLayer.draw();
}

Template.core_sensor3d.events({
  'click .flipper': function (e, t) {
    if (currentDimensions.y === 'z') {
      currentDimensions.y = 'y';
      currentDimensions.flippedY = -1;
    } else {
      currentDimensions.y = 'z';
      currentDimensions.flippedY = 1;
    }
    Session.set('currentDimension', currentDimensions.y);
    refreshGrid();
  },
  'contextmenu .sensorgrid-container': function (e, t) {
    e.preventDefault();
  },
  'contextmenu #sensorContacts img': function (e, t) {
    Session.set('currentSensorIcon', {
      kind: 'army',
      which: e.target.parentElement.title
    });
  },
  'contextmenu #gridContacts': function (e, t) {
    Session.set('currentSensorIcon', {
      kind: 'grid',
      which: e.target.parentElement.title
    });
  },
  'click #sensorContacts': function (e, t) {
    // console.log(e.which);
  },
  'click #wormhole': function (e, t) {
    if (e.target.checked) {
      Flint.system('Sensors','wormhole', 'true');
    } else {
      Flint.system('Sensors','wormhole', 'false');
    }
  }
});
