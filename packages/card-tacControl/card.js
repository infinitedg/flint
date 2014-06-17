var stage, symbolsLayer, contactsLayer, ghostLayer;
var backBox;
var curveLayer, lineLayer, anchorLayer, quad, bezier = {};
var ULLoc = '',
    URLoc = '',
    BLLoc = '',
    BRLoc = '';
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

function resetLocs() {
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

function addKeyframe() {};

function symbolControls(e) {
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

function timelineControls(e) {
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
        tl = new TimelineLite({
            onUpdate: updateSlider
        });
    $("#slider").slider({
        range: true,
        tooltip: false,
        value: 0,
        min: 0,
        max: 100,
        step: .1,
        slide: function (event, ui) {
            tl.progress(ui.value / 100).pause();
        }
    });

    function updateSlider() {
        $("#slider").slider("value", tl.progress() * 100);
    }
};

// Bezier
  
  bezierFunc = function (t, p0, p1, p2, p3) {
        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;

        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;

        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

        return {
            x: x,
            y: y
        };
    };

  function updateDottedLines() {
        for (var curveid in bezier){
            var b = bezier[curveid];
            var bezierLine = b.bezierLine;
            bezierLine.setPoints([b.start.attrs.x, b.start.attrs.y, b.control1.attrs.x, b.control1.attrs.y, b.control2.attrs.x, b.control2.attrs.y, b.end.attrs.x, b.end.attrs.y]);
       };
       // }; 
        lineLayer.draw();
      };
      
       drawCurves = function() {
        for (var curveid in bezier){
            var curve = bezier[curveid];
            var accuracy = 0.01, //this'll give the bezier 100 segments
            p0 = {
                x: curve.start.attrs.x,
                y: curve.start.attrs.y
            }, 
            p1 = {
                x: curve.control1.attrs.x,
                y: curve.control1.attrs.y
            },
            p2 = {
                x: curve.control2.attrs.x,
                y: curve.control2.attrs.y
            },
            p3 = {
                x: curve.end.attrs.x,
                y: curve.end.attrs.y
            },
            linePoints = [];
            
            for (var i = 0; i < 1; i += accuracy) {
                var p = bezierFunc(i, p0, p1, p2, p3);
                linePoints.push(p.x);
                linePoints.push(p.y);
            }
            curve.curveLine.attrs.points = linePoints;
           
           var headlen = 13;   // length of head in pixels
            var angle = Math.atan2(curve.end.attrs.y-curve.control2.attrs.y,curve.end.attrs.x-curve.control2.attrs.x);
            var ax = curve.end.attrs.x-headlen*Math.cos(angle-Math.PI/6);
            var ay = curve.end.attrs.y-headlen*Math.sin(angle-Math.PI/6);
            var arrowPoints = [curve.end.attrs.x, curve.end.attrs.y, curve.end.attrs.x-headlen*Math.cos(angle+Math.PI/6),curve.end.attrs.y-headlen*Math.sin(angle+Math.PI/6),ax,ay];
            curve.arrow.attrs.points = arrowPoints;
         };
        curveLayer.draw();

      }

      function buildBezierLine() {
        var bezierLine = new Kinetic.Line({
          dashArray: [10, 10, 0, 10],
          strokeWidth: 3,
          stroke: 'gray',
          lineCap: 'round',
          id: 'bezierLine',
          opacity: 0.3,
          points: [0, 0]
        });

        lineLayer.add(bezierLine);
        return bezierLine;
      };

      
      function buildAnchor(x, y, id) {
        var anchor = new Kinetic.Circle({
          x: x,
          y: y,
          radius: 5,
          stroke: '#666',
          fill: '#ddd',
          strokeWidth: 1,
          draggable: true,
          parentid: id,
          opacity: .5
        });

        // add hover styling
        anchor.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
          this.setStrokeWidth(4);
          anchorLayer.draw();
        });
        anchor.on('mouseout', function() {
          document.body.style.cursor = 'default';
          this.setStrokeWidth(2);
          anchorLayer.draw();
          
        });

        anchor.on('dragend', function() {
          drawCurves();
          updateDottedLines();
                debugger;
          var curve = bezier[this.attrs.parentid];            
          var updateObj = {
                start: {x:curve.start.attrs.x, y:curve.start.attrs.y},
                control1: {x:curve.control1.attrs.x, y:curve.control1.attrs.y},
                control2: {x:curve.control2.attrs.x, y:curve.control2.attrs.y},
                end: {x:curve.end.attrs.x, y:curve.end.attrs.y}
            };
           /* if (x < 0 || x > 720 || y < 0 || y > 315) {
              Flint.collection('tacticalContacts').remove(id);
              Session.set('selectedSymbol', '');
            } else {*/
                Flint.collection('tacticalContacts').update(id, {
                $set: updateObj
            });
            /*}*/
        });

        anchorLayer.add(anchor);
        return anchor;
      }
      function buildArrow(options){
            var headlen = 13;   // length of head in pixels
            var angle = Math.atan2(options.end.y-options.control2.y,options.end.x-options.control2.x);

            var ax = options.end.x-headlen*Math.cos(angle-Math.PI/6);
            var ay = options.end.y-headlen*Math.sin(angle-Math.PI/6);
            var arrowPoints = [options.end.x, options.end.y, options.end.x-headlen*Math.cos(angle+Math.PI/6),options.end.y-headlen*Math.sin(angle+Math.PI/6),ax,ay];
            
            var lineArrow = new Kinetic.Line({
                points: arrowPoints,
                stroke: options.color,
                fill: options.color,
                strokeWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
                closed: true
            });
        if(!options.hasArrow) {
            lineArrow.attrs.opacity = 0;
        }
        curveLayer.add(lineArrow);
        return lineArrow;
    };  

        // add dotted line connectors
    var addBezier = function(id, options) {

        var curveLine = new Kinetic.Line({
            //points: linePoints,
            stroke: options.color,
            strokeWidth: 5,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: false
        });

            // add hover styling
        curveLine.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
          this.setStrokeWidth(6);
          anchorLayer.draw();
        });
        curveLine.on('mouseout', function() {
          document.body.style.cursor = 'default';
          this.setStrokeWidth(5);
          anchorLayer.draw();
          
        });

        curveLine.on('dragend', function() {
          drawCurves();
          updateDottedLines();
        });

        curveLayer.add(curveLine);

        var newBezier = {

          start: buildAnchor(options.start.x, options.start.y, id),
          control1: buildAnchor(options.control1.x, options.control1.y, id),
          control2: buildAnchor(options.control2.x, options.control2.y, id),
          end: buildAnchor(options.end.x, options.end.y, id),
          bezierLine: buildBezierLine(),
          arrow: buildArrow(options),
          curveLine: curveLine
        };


        bezier[id] = newBezier;
        drawCurves();
        updateDottedLines();
        anchorLayer.draw();
      };

      function updateBezier(id, options){
        curve = bezier[id];
        curve.start.attrs.x = options.start.x;
        curve.start.attrs.y = options.start.y;
        curve.control1.attrs.x = options.control1.x;
        curve.control1.attrs.y = options.control1.y;
        curve.control2.attrs.x = options.control2.x;
        curve.control2.attrs.y = options.control2.y;
        curve.end.attrs.x = options.end.x;
        curve.end.attrs.y = options.end.y;
        curve.curveLine.attrs.stroke = options.color;
        curve.arrow.attrs.stroke = options.color;
        curve.arrow.attrs.fill = options.color;
        if (options.hasArrow){
            curve.arrow.attrs.opacity = 1;
        } else {
            curve.arrow.attrs.opaticy = 0;
        }
        drawCurves();
        updateDottedLines();
        anchorLayer.draw();
      };
//
Template.card_tacControl.stage = function (e) {
    return stage;
};
Template.card_tacControl.events = {
    'click body': function (e, context) {
        Session.set('selectedSymbol', '');
    },
        'click .screenPicker': function (e, context) {
        var target = $(e.target);
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                currentScreen: target.attr('placeholder')
            }
        });
        e.preventDefault();
    },
        'change #screenSelect': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                currentScreen: target
            }
        });
        e.preventDefault();
    },
        'change #videoSelect': function (e, context) {
        var target = e.target.value;
        Flint.simulators.update(Flint.simulatorId(), {
            $set: {
                tacticalVideo: target
            }
        });
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
        'slideStop #symbolSize': function (e, context) {
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        var target = contactsArray[Session.get('selectedSymbol')].contact;
        updateObj['width'] = target.attrs.width;
        updateObj['height'] = target.attrs.height;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'slide #symbolSize': function (e, context) {
        var value = (e.value) / 4;
        var target = contactsArray[Session.get('selectedSymbol')].contact;
        var aspect = target.attrs.image.height / target.attrs.image.width;
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
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'click .manualMove': function (e, context) {
        var target = e.target;
        if (target.id == 'manualMove1') {
            if (Session.get('manualMoveIJKL') == Session.get('selectedSymbol')) {
                Session.set('manualMoveIJKL', '');
            }
            Session.set('manualMoveWASD', Session.get('selectedSymbol'));
        } else if (target.id == 'manualMove2') {
            if (Session.get('manualMoveWASD') == Session.get('selectedSymbol')) {
                Session.set('manualMoveWASD', '');
            }
            Session.set('manualMoveIJKL', Session.get('selectedSymbol'));
        }
    },
        'hidePicker #contactColor': function (e, context) {
        var target = contactsArray[Session.get('selectedSymbol')].contact;
        var colors = e.color.toRGB();
        //target.attrs.blue = colors.b;
        //target.attrs.red = colors.r;
        //target.attrs.green = colors.g;
        //target.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
        //target.cache();
        //contactsLayer.draw();
        var updateObj = {};
        var id = Session.get('selectedSymbol');
        updateObj['red'] = colors.r;
        updateObj['green'] = colors.g;
        updateObj['blue'] = colors.b;
        Flint.collection('tacticalContacts').update(id, {
            $set: updateObj
        });
    },
        'click #addCurve': function (e, context) {
        var updateObj = {
                            
                type: 'bezier',
                selected: false,
                isVisible: true,
                start: {x:100, y:100},
                control1: {x:150, y:125},
                control2: {x: 175, y:200},
                end: {x: 150, y:150},
                color: "red",
                hasArrow: true,
                simulatorId: Flint.simulatorId()
            };

            Flint.collection('tacticalContacts').insert(updateObj);
        },
        'hidePicker #curveColor': function (e, context) {
            var colors = e.color.toRGB();

        },
        'click #playBtn': function (e, context) {
        //Play the tween forward from the current position.
        //If tween is complete, play() will have no effect
        tl.play();
    },
        'click pauseBtn': function (e, context) {
        tl.pause();
    },
        'click resumeBtn': function (e, context) {
        //Resume playback in current direction.
        tl.resume();
    },
        'click reverseBtn': function (e, context) {
        tl.reverse();
    },
        'click playFromBtn': function (e, context) {
        //Play from a sepcified time (in seconds).
        tl.play(1);
    },
        'click reverseFromBtn': function (e, context) {
        //Reverse from a specified time (in seconds).
        tl.reverse(1);
    },
        'click seekBtn': function (e, context) {
        //Jump to specificied time (in seconds) without affecting
        //whether or not the tween is paused or reversed.
        tl.seek(1.5);
    },
        'click timeScaleSlowBtn': function (e, context) {
        //timescale of 0.5 will make the tween play at half-speed (slower).
        //Tween will take 12 seconds to complete (normal duration is 6 seconds).
        tl.timeScale(0.5);
    },
        'click timeScaleNormalBtn': function (e, context) {
        //timescale of 1 will make tween play at normal speed.
        tl.timeScale(1);
    },
        'click timeScaleFastBtn': function (e, context) {
        //timescale of 1 will make the tween play at double-speed (faster).
        //Tween will take 3 seconds to complete (normal duration is 6 seconds).
        tl.timeScale(2);
    },
        'click restartBtn': function (e, context) {
        //Start playing from a progress of 0.
        tl.restart();
    }
};
/*Template.card_tacControl.isChecked = function(which){
var a = Flint.simulator().currentScreen;
if (which == a){
return 'checked';
} else {
return '';
}
};*/
Template.card_tacControl.destroyed = function (e) {};
Template.card_tacControl.rendered = function (e) {
    timelineControls();
    symbolControls();
    $('.colorpicker').colorpicker();
    $(window).on('keydown', function (e) {
        if (Session.get('selectedSymbol')) {
            var id = Session.get('selectedSymbol');
            var target = contactsArray[Session.get('selectedSymbol')].contact;
            var updateObj = {};
            if (e.which == 87) { //'w'
                //updateObj['X'] = target.attrs.x + 1;
                updateObj['Y'] = target.attrs.y - 1;
                Flint.collection('tacticalContacts').update(id, {
                    $set: updateObj
                });
            }
            if (e.which == 83) { //'s'
                updateObj['Y'] = target.attrs.y + 1;
                Flint.collection('tacticalContacts').update(id, {
                    $set: updateObj
                });
            }
            if (e.which == 65) { //'a'
                updateObj['X'] = target.attrs.x - 1;
                Flint.collection('tacticalContacts').update(id, {
                    $set: updateObj
                });
            }
            if (e.which == 68) { //'d'
                updateObj['X'] = target.attrs.x + 1;
                Flint.collection('tacticalContacts').update(id, {
                    $set: updateObj
                });
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
    anchorLayer = new Kinetic.Layer();
    lineLayer = new Kinetic.Layer();
    curveLayer = new Kinetic.Layer();
    contactsLayer = new Kinetic.Layer();
    symbolsLayer = new Kinetic.Layer();
    ghostLayer = new Kinetic.Layer();
    gridLayer = new Kinetic.Layer();

    // keep curves insync with the lines
    anchorLayer.on('beforeDraw', function() {
      drawCurves();
      updateDottedLines();
    });

    var selectionLocImage = new Image();
    selectionLocImage.onload = function () {
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
    this.subscription = Deps.autorun(function () {
        Meteor.subscribe('cards.card-tacControl.symbols', Flint.simulatorId());
        Meteor.subscribe('cards.card-tacControl.contacts', Flint.simulatorId());
    });
    this.selectionWatcher = Deps.autorun(function (c) {
        if (Session.get('selectedSymbol') !== '') {
            $('#symbolControls').removeClass('hidden');
            resetLocs();
            URLoc.opacity = 1;
            ULLoc.opacity = 1;
            BRLoc.opacity = 1;
            BLLoc.opacity = 1;
            var target = contactsArray[Session.get('selectedSymbol')].contact;
            $('#symbolSize').slider('setValue', (target.attrs.width * 4));
            //$('#symbolRotation').slider('setValue', (target.rotation()));
        } else if (URLoc) {
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
    backBox.on('mousedown', function (e) {
        Session.set('selectedSymbol', '');
    });
    for (i = 1; i < 24; i++) {
        var line = new Kinetic.Line({
            points: [i * 60, 0, i * 60, 315],
            dash: [10, 5],
            fill: 'green',
            stroke: 'green',
            strokeWidth: 1
        });
        gridLayer.add(line);
    }
    for (i = 1; i < 5; i++) {
        var line = new Kinetic.Line({
            points: [0, i * 60, 720, i * 60],
            dash: [10, 5],
            fill: 'green',
            stroke: 'green',
            strokeWidth: 1
        });
        gridLayer.add(line);
    }
    this.tacSymbolsObserver = Flint.collection('tacSymbols').find().observe({
        addedAt: function (doc, atIndex) {
            var id = doc._id;
            // console.log("Added", id, doc);
            if (!armyArray[id]) {
                armyArray[id] = {};
                // Draggable Contact
                var contactObj = new Image();
                contactObj.onload = function () {
                    var icon = new Kinetic.Image({
                        x: atIndex * (50 * k.scale + 5),
                        y: (315 + 50 * k.scale / 2),
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
                    icon.on('dragend', function (evt) {
                        var cTmpl = Flint.collection('tacSymbols').findOne(id);
                        var //x = ( currentDimensions.flippedX * 2 * (this.getX() + k.width + 30) / k.width) + 1 * currentDimensions.flippedX * -1,
                        //y = ( currentDimensions.flippedY * 2 * (this.getY()) / k.height) + 1 * currentDimensions.flippedY * -1,
                        x = this.getX(),
                            y = this.getY(),
                            width = this.attrs.image.width,
                            height = this.attrs.image.height,
                            d = true;
                        if (d) { // Only drop the contact if we are within 120% of the grid's radius
                            var updateObj = _.extend(cTmpl, {
                                red: 0,
                                green: 255,
                                blue: 0,
                                type: 'contact',
                                isMoving: true,
                                selected: true,
                                isVisible: true,
                                velocity: 0.05
                            });
                            updateObj['X'] = x;
                            updateObj['Y'] = y;
                            updateObj['width'] = 50;
                            updateObj['height'] = (height / width) * 50;
                            delete updateObj['_id'];
                            Flint.collection('tacticalContacts').insert(updateObj);
                        }
                        // Move back to the origin
                        this.setY(315 + 50 * k.scale / 2);
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
        changedAt: function (id, fields) {
            // Update kinetic image properties
        },
        removedAt: function (id) {}
    });
    this.tacticalObserver = Flint.collection('tacticalContacts').find().observeChanges({
        added: function (id, doc) {
            // console.log("Added", id, doc);
          if (doc['type'] === 'contact'){  
            if (!contactsArray[id]) {

                contactsArray[id] = {};
                // Draggable Contact
                var contactObj = new Image();
                contactObj.onload = function () {
                    var icon = new Kinetic.Image({
                        x: transformX(doc['X']),
                        y: transformY(doc['Y']),
                        selected: true,
                        image: contactObj,
                        width: (doc['width']),
                        height: (doc['height']),
                        draggable: true,
                        red: doc['red'],
                        green: doc['green'],
                        blue: doc['blue']
                    });
                    // Setup filters
                    icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
                    // Dragging handler
                    icon.on('mousedown', function (evt) {
                        Session.set('selectedSymbol', id);
                        contactsLayer.draw();
                    });
                    icon.on('dragstart', function (evt) {
                        Session.set('selectedSymbol', id);
                        contactsLayer.draw();
                    });
                    icon.on('dragmove', function (evt) {
                        resetLocs();
                    });
                    icon.on('dragend', function (evt) {
                        var x = this.getX(),
                            y = this.getY(),
                            updateObj = {
                                isMoving: true
                            };
                        if (x < 0 || x > 720 || y < 0 || y > 315) {
                            Flint.collection('tacticalContacts').remove(id);
                            Session.set('selectedSymbol', '');
                        } else {
                            updateObj['X'] = x;
                            updateObj['Y'] = y;
                            Flint.collection('tacticalContacts').update(id, {
                                $set: updateObj
                            });
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
          }
          if (doc['type'] === 'bezier'){ 
            if (!bezier[id]){
               addBezier(id, doc);
            }
          } 
        },
        changed: function (id, fields) {
            // console.log("Changed", id, fields);
            if (fields['type'] === 'contact'){
                var contact = contactsArray[id].contact;
                if (contact) {
                    if (fields['X'] !== undefined) {
                        contact.setX(transformX(fields['X']));
                    }
                    if (fields['Y'] !== undefined) {
                        contact.setY(transformY(fields['Y']));
                    }
                    if (fields['red'] !== undefined) {
                        contact.attrs.red = fields['red'];
                        contact.attrs.green = fields['green'];
                        contact.attrs.blue = fields['blue'];
                        contact.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
                        contact.cache();
                    }
                    resetLocs();
                    contactsLayer.draw();
                }
            }
            if (fields['type'] === 'bezier'){
                updateBezier(id,fields);
            }
        },
        removed: function (id) {
            // console.log("Removed", id);
            if (contactsArray.hasOwnProperty(id)){
                contactsArray[id].contact.remove();
                delete contactsArray[id];
                contactsLayer.draw();
            }
            if (bezier.hasOwnProperty(id)){

            }
        }
    });
    stage.add(gridLayer);
    stage.add(ghostLayer);
    stage.add(symbolsLayer);
    stage.add(lineLayer);
    stage.add(curveLayer);
    stage.add(anchorLayer);
    stage.add(contactsLayer); // Uppermost layer
};