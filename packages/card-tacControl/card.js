var stage,symbolsLayer,contactsLayer,ghostLayer;
var backBox;
var ULLoc = '',URLoc = '',BLLoc = '',BRLoc ='';
window.currentDimensions = {
  x: 'x',
  y: 'y',
  flippedX: 1,
  flippedY: 1,
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

function transformX(x) {
  //return k.width * ((x * currentDimensions.flippedX) + 1) / 2; // Translate and scale to different coordinate system
  return x;
};

function transformY(y) {
  //return k.height * ((y * currentDimensions.flippedY) + 1) / 2; // Flip, translate, and scale to different coordinate system
  return y;
};

function resetLocs(){
  var target = contactsArray[Session.get('selectedSymbol')].contact;
  URLoc.setX(target.attrs.x + target.attrs.width - 10);
  URLoc.setY(target.attrs.y - 9);
  ULLoc.setX(target.attrs.x - 9);
  ULLoc.setY(target.attrs.y + 10);
  BRLoc.setX(target.attrs.x + target.attrs.width + 9);
  BRLoc.setY(target.attrs.y + target.attrs.width - 10);
  BLLoc.setX(target.attrs.x + 10);
  BLLoc.setY(target.attrs.y + target.attrs.width + 9);
        
};

var armyArray = {};
var contactsArray = {};

k.center = {
  x: k.width / 2,
  y: k.height / 2
};

k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;

function addKeyframe(){

};

function symbolControls(e){
  $('#symbolSize').slider({
    range: true,
    tooltip: false,
    value: 100,
    min: 20,
    max: 1000,
    step: 1
  });
 /* $('#symbolRotation').slider({
    range: true,
    tooltip: false,
    value: 100,
    min: 0,
    max: 360,
    step: 1
  });*/
};
function timelineControls(e){
      var playBtn = $("#playBtn"),
          pauseBtn = $("#pauseBtn"),
          resumeBtn = $("#resumeBtn"),
          reverseBtn = $("#reverseBtn"),
          playFromBtn = $("#playFromBtn"),
          reverseFromBtn = $("#reverseFromBtn"),
          seekBtn = $("#seekBtn"),
          timeScaleSlowBtn = $("#timeScaleSlowBtn"),
          timeScaleNormalBtn = $("#timeScaleNormalBtn"),
          timeScaleFastBtn = $("#timeScaleFastBtn"),
          restartBtn = $("#restartBtn"),
          tl = new TimelineLite({onUpdate:updateSlider});    
           
      $( "#slider" ).slider({
              range: true,
              tooltip: false,
              value: 0,
              min: 0,
              max: 100,
              step:.1,
              slide: function ( event, ui ) {
                  tl.progress( ui.value/100 ).pause();
              }
      });    
               
      function updateSlider() {
          $("#slider").slider("value", tl.progress() *100);
      }                   
       
};
Template.card_tacControl.stage = function(e){
return stage
};

Template.card_tacControl.events = {
  'click body': function(e,context){
    Session.set('selectedSymbol', '');
  },
  'click .screenPicker': function(e, context) {
    var target = $(e.target);
    Flint.simulators.update(Flint.simulatorId(), {$set: {currentScreen: target.attr('placeholder')}});
    e.preventDefault();
  },
  'change #screenSelect': function(e, context){
   var target = e.target.value;
    Flint.simulators.update(Flint.simulatorId(), {$set: {currentScreen: target}});
    e.preventDefault();
  },
  'change #videoSelect': function(e, context){
    var target = e.target.value;
    Flint.simulators.update(Flint.simulatorId(), {$set: {tacticalVideo: target}});
    e.preventDefault();
  },
  /*'slide #symbolRotation': function(e, context){
    var value = (e.value);
    var target = contactsArray[Session.get('selectedSymbol')].contact;
    var xVal = target.attrs.x;
    var yVal = target.attrs.y;
    target.offset({x: target.attrs.width/2, y:target.attrs.height/2});
    //target.setPosition(stage.getWidth()/2,stage.getHeight()/2);
    target.clearCache();
    target.rotation(value);
    target.offset({x:0, y:0});
    contactsLayer.draw();
  },*/
  'slideStop #symbolSize' : function(e, context){
    var updateObj = {};
    var id = Session.get('selectedSymbol');
    var target = contactsArray[Session.get('selectedSymbol')].contact;
    updateObj['width'] = target.attrs.width;
    updateObj['height'] = target.attrs.height;
    Flint.collection('tacticalContacts').update(id, {$set: updateObj});
  },
  'slide #symbolSize': function(e, context){
    var value = (e.value)/4;
    var target = contactsArray[Session.get('selectedSymbol')].contact;
    var aspect = target.attrs.image.height/target.attrs.image.width;
    target.clearCache();

    target.attrs.width = value;
    target.attrs.height = value * aspect;
    target.cache();
    resetLocs();
    contactsLayer.draw();
     var updateObj = {};
    var id = Session.get('selectedSymbol');
     updateObj['width'] = target.attrs.width;
    updateObj['height'] = target.attrs.height;
    Flint.collection('tacticalContacts').update(id, {$set: updateObj});
  },
  'click .manualMove': function(e, context){
    var target=e.target;
    if (target.id == 'manualMove1'){
      if (Session.get('manualMoveIJKL') == Session.get('selectedSymbol')){
        Session.set('manualMoveIJKL','');
      }
      Session.set('manualMoveWASD',Session.get('selectedSymbol'));
    } else if (target.id == 'manualMove2'){
      if (Session.get('manualMoveWASD') == Session.get('selectedSymbol')){
        Session.set('manualMoveWASD','');
      }
      Session.set('manualMoveIJKL',Session.get('selectedSymbol'));
    }
  },
  'click #playBtn': function(e, context){
          //Play the tween forward from the current position.
          //If tween is complete, play() will have no effect
          tl.play();
      },
      'click pauseBtn': function(e, context){
          tl.pause();
      },
      'click resumeBtn': function(e, context){
          //Resume playback in current direction.
          tl.resume();
      },
      'click reverseBtn': function(e, context){
          tl.reverse();
      },
      'click playFromBtn': function(e, context){
          //Play from a sepcified time (in seconds).
          tl.play(1);
      },
      'click reverseFromBtn': function(e, context){
          //Reverse from a specified time (in seconds).
          tl.reverse(1);
      },
      'click seekBtn': function(e, context){
          //Jump to specificied time (in seconds) without affecting
          //whether or not the tween is paused or reversed.
          tl.seek(1.5);
      },
      'click timeScaleSlowBtn': function(e, context){
          //timescale of 0.5 will make the tween play at half-speed (slower).
          //Tween will take 12 seconds to complete (normal duration is 6 seconds).
          tl.timeScale(0.5);
      },
      'click timeScaleNormalBtn': function(e, context){
          //timescale of 1 will make tween play at normal speed.
          tl.timeScale(1);
      },
      'click timeScaleFastBtn': function(e, context){
          //timescale of 1 will make the tween play at double-speed (faster).
          //Tween will take 3 seconds to complete (normal duration is 6 seconds).
          tl.timeScale(2);
      },
      'click restartBtn': function(e, context){
          //Start playing from a progress of 0.
          tl.restart();
      }

};
Template.card_tacControl.isChecked = function(which){
  var a = Flint.simulator().currentScreen;
  if (which == a){
    return 'checked';
  } else {
    return '';
  }
};
Template.card_tacControl.destroyed = function(e){
};

Template.card_tacControl.rendered = function(e){
  timelineControls();
  symbolControls();

  $(window).on('keydown', function(e){
    if (Session.get('selectedSymbol')){
      var id = Session.get('selectedSymbol');
      var target = contactsArray[Session.get('selectedSymbol')].contact;
       var updateObj = {};
      if (e.which == 87){ //'w'
        //updateObj['X'] = target.attrs.x + 1;
        updateObj['Y'] = target.attrs.y - 1;
        Flint.collection('tacticalContacts').update(id, {$set: updateObj});
      }
      if (e.which == 83){ //'s'
        updateObj['Y'] = target.attrs.y + 1;
        Flint.collection('tacticalContacts').update(id, {$set: updateObj});
      }
      if (e.which == 65){ //'a'
        updateObj['X'] = target.attrs.x - 1;
        Flint.collection('tacticalContacts').update(id, {$set: updateObj});
      }
      if (e.which == 68){ //'d'
        updateObj['X'] = target.attrs.x + 1;
        Flint.collection('tacticalContacts').update(id, {$set: updateObj});
      }
    }
    console.log(e.which);
  });

   Session.set('selectedSymbol', '');
    stage = new Kinetic.Stage({
        container: 'tacControl',
        width: 720,
        height: 350
      });

      

    contactsLayer = new Kinetic.Layer();
    symbolsLayer = new Kinetic.Layer();
    ghostLayer = new Kinetic.Layer();
    gridLayer = new Kinetic.Layer();

  var selectionLocImage = new Image();
  selectionLocImage.onload = function() {
     URLoc = new Kinetic.Image({
      image: selectionLocImage,
      x: 20,
      y: 20,
      width: 19,
      height: 20,
      draggable: false,
      red: 255,
      green: 0,
      blue: 0
    });
    contactsLayer.add(URLoc);
     ULLoc = new Kinetic.Image({
      image: selectionLocImage,
      x: 40,
      y: 20,
      width: 19,
      height: 20,
      draggable: false,
      red: 255,
      green: 0,
      blue: 0,
      rotation: 270
    });
    contactsLayer.add(ULLoc);

     BRLoc = new Kinetic.Image({
      image: selectionLocImage,
      x: 20,
      y: 40,
      width: 19,
      height: 20,
      draggable: false,
      red: 255,
      green: 0,
      blue: 0,
      rotation: 90
    });
    contactsLayer.add(BRLoc);
     BLLoc = new Kinetic.Image({
      image: selectionLocImage,
      x: 40,
      y: 40,
      width: 19,
      height: 20,
      draggable: false,
      red: 255,
      green: 0,
      blue: 0,
      rotation: 180
    });
    contactsLayer.add(BLLoc);
    URLoc.opacity = 0;
      ULLoc.opacity = 0;
      BRLoc.opacity = 0;
      BLLoc.opacity = 0;
      URLoc.setX(-500);
      ULLoc.setX(-500);
      BRLoc.setX(-500);
      BLLoc.setX(-500);
  };
  selectionLocImage.src = "/packages/card-tacControl/images/cornerLoc.png";

  

  this.subscription = Deps.autorun(function() {
    Meteor.subscribe('cards.card-tacControl.symbols', Flint.simulatorId());
    Meteor.subscribe('cards.card-tacControl.contacts', Flint.simulatorId());
  });

  this.selectionWatcher = Deps.autorun(function(c) {
    if (Session.get('selectedSymbol') != ''){
      $('#symbolControls').removeClass('hidden');
      resetLocs();
      URLoc.opacity = 1;
      ULLoc.opacity = 1;
      BRLoc.opacity = 1;
      BLLoc.opacity = 1;
        var target = contactsArray[Session.get('selectedSymbol')].contact;
      $('#symbolSize').slider('setValue', (target.attrs.width*4));
      //$('#symbolRotation').slider('setValue', (target.rotation()));
      
    } else if(URLoc){
      $('#symbolControls').addClass('hidden');
      URLoc.opacity = 0;
      ULLoc.opacity = 0;
      BRLoc.opacity = 0;
      BLLoc.opacity = 0;
      URLoc.setX(-500);
      ULLoc.setX(-500);
      BRLoc.setX(-500);
      BLLoc.setX(-500);
    }
    contactsLayer.draw();
   // c.stop();
  });

       backBox = new Kinetic.Rect({
        x: 1,
        y: 1,
        width: 718,
        height: 313,
        fill: 'black',
        stroke: 'green'
      });
      gridLayer.add(backBox);

      backBox.on('mousedown', function(e){
        Session.set('selectedSymbol','')
      });
      for (i=1; i<24; i++){
        var line = new Kinetic.Line({
        points: [i*60,0,i*60,315],
        dash: [10, 5],
        fill: 'green',
        stroke: 'green',
        strokeWidth: 1
      });
        gridLayer.add(line);
      }
      for (i=1; i<5; i++){
         var line = new Kinetic.Line({
        points: [0,i*60,720,i*60],
        dash: [10, 5],
        fill: 'green',
        stroke: 'green',
        strokeWidth: 1
      });
        gridLayer.add(line);

      }
  
    this.tacSymbolsObserver = Flint.collection('tacSymbols').find().observe({
    addedAt: function(doc, atIndex) {
      var id = doc._id;
      // console.log("Added", id, doc);
      if (!armyArray[id]) {
        armyArray[id] = {};

        // Draggable Contact
        var contactObj = new Image();
        contactObj.onload = function() {
          var icon = new Kinetic.Image({
            x: atIndex * (50 * k.scale + 5),
            y: (315 + 50*k.scale/2),
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
            var cTmpl = Flint.collection('tacSymbols').findOne(id);
            var //x = ( currentDimensions.flippedX * 2 * (this.getX() + k.width + 30) / k.width) + 1 * currentDimensions.flippedX * -1,
                //y = ( currentDimensions.flippedY * 2 * (this.getY()) / k.height) + 1 * currentDimensions.flippedY * -1,
                x = this.getX(),
                y = this.getY(),
                width = this.attrs.image.width,
                height = this.attrs.image.height,
                d = true;
            if (d) { // Only drop the contact if we are within 120% of the grid's radius
              var updateObj = _.extend(cTmpl, {isMoving: true, selected: true, isVisible: true, velocity: 0.05});
              updateObj['X'] = x;
              updateObj['Y'] = y;
              updateObj['width'] = 50;
              updateObj['height'] = (height/width)*50;
              delete updateObj['_id'];
              Flint.collection('tacticalContacts').insert(updateObj);
            }
              // Move back to the origin
              this.setY(315 + 50*k.scale/2);
              this.setX(atIndex * (50 * k.scale + 5));
              symbolsLayer.draw();
          });

          // add the shape to the layer
          symbolsLayer.add(icon);
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
  });

this.tacticalObserver = Flint.collection('tacticalContacts').find().observeChanges({
    added: function(id, doc) {
      // console.log("Added", id, doc);
      if (!contactsArray[id]) {
        contactsArray[id] = {};
        // Draggable Contact
        var contactObj = new Image();
        contactObj.onload = function() {
          var icon = new Kinetic.Image({
            x: transformX(doc['X']),
            y: transformY(doc['Y']),
            selected: true,
            image: contactObj,
            width: (doc['width']),
            height: (doc['height']),
            draggable: true,
            red: k.filter.red,
            green: k.filter.green,
            blue: k.filter.blue
          });

          // Setup filters
          icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
          // Dragging handler
          icon.on('mousedown', function(evt){
            Session.set('selectedSymbol', id);
            contactsLayer.draw();
          });
          icon.on('dragstart', function(evt) {
            Session.set('selectedSymbol', id);
            contactsLayer.draw();
          });
          icon.on('dragmove', function(evt) {
            resetLocs();
          });
          icon.on('dragend', function(evt) {
            var x = this.getX(),
                y = this.getY(),
            updateObj = {isMoving: true};
            if (x < 0 || x > 720 || y < 0 || y > 315){
              Flint.collection('tacticalContacts').remove(id);
              Session.set('selectedSymbol', '')
            } else {
              updateObj['X'] = x;
              updateObj['Y'] = y;
              Flint.collection('tacticalContacts').update(id, {$set: updateObj});
            }
          });

          // add the shape to the layer
          contactsLayer.add(icon);
          icon.cache();
          icon.draw();
          contactsArray[id].contact = icon;
          Session.set('selectedSymbol', id);
        };
        contactObj.src = k.spritePath + doc.icon;
        // Ghost Contact
       /* var ghostObj = new Image();
        ghostObj.onload = function() {
          var icon = new Kinetic.Image({
            x: transformX(doc['X']),
            y: transformY(doc['Y']),
            image: ghostObj,
            width: 50,
            height: 50,
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
        ghostObj.src = k.spritePath + doc.icon;*/
      }
    },
    changed: function(id, fields) {
      // console.log("Changed", id, fields);
      var contact = contactsArray[id].contact
      if (contact) {

        if (fields['X'] !== undefined) {
          contact.setX(transformX(fields['X']));
        }
        if (fields['Y'] !== undefined) {
          contact.setY(transformY(fields['Y']));
        }

        resetLocs();
        contactsLayer.draw();
      }
    },
    removed: function(id) {
      // console.log("Removed", id);
      contactsArray[id].contact.remove();
      delete contactsArray[id];
      contactsLayer.draw();
    }
  });
  

  stage.add(gridLayer);
  stage.add(ghostLayer);
  stage.add(symbolsLayer);
  stage.add(contactsLayer); // Uppermost layer
};
