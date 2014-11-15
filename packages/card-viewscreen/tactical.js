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
    for (var curveid in bezier) {
        var b = bezier[curveid];
        var bezierLine = b.bezierLine;
        bezierLine.setPoints([b.start.attrs.x, b.start.attrs.y, b.control1.attrs.x, b.control1.attrs.y, b.control2.attrs.x, b.control2.attrs.y, b.end.attrs.x, b.end.attrs.y]);
    }
    // }; 
    lineLayer.draw();
}

drawCurves = function () {
    for (var curveid in bezier) {
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

        var headlen = 13; // length of head in pixels
        var angle = Math.atan2(curve.end.attrs.y - curve.control2.attrs.y, curve.end.attrs.x - curve.control2.attrs.x);
        var ax = curve.end.attrs.x - headlen * Math.cos(angle - Math.PI / 6);
        var ay = curve.end.attrs.y - headlen * Math.sin(angle - Math.PI / 6);
        var arrowPoints = [curve.end.attrs.x, curve.end.attrs.y, curve.end.attrs.x - headlen * Math.cos(angle + Math.PI / 6), curve.end.attrs.y - headlen * Math.sin(angle + Math.PI / 6), ax, ay];
        curve.arrow.attrs.points = arrowPoints;
    }
    curveLayer.draw();

};

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
}


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
        opacity: 0.5
    });

    anchorLayer.add(anchor);
    return anchor;
}

function buildArrow(options) {
    var headlen = 13; // length of head in pixels
    var angle = Math.atan2(options.end.y - options.control2.y, options.end.x - options.control2.x);

    var ax = options.end.x - headlen * Math.cos(angle - Math.PI / 6);
    var ay = options.end.y - headlen * Math.sin(angle - Math.PI / 6);
    var arrowPoints = [options.end.x, options.end.y, options.end.x - headlen * Math.cos(angle + Math.PI / 6), options.end.y - headlen * Math.sin(angle + Math.PI / 6), ax, ay];

    var lineArrow = new Kinetic.Line({
        points: arrowPoints,
        stroke: options.color,
        fill: options.color,
        strokeWidth: 5,
        lineCap: 'round',
        lineJoin: 'round',
        closed: true
    });
    if (!options.hasArrow) {
        lineArrow.attrs.opacity = 0;
    }
    curveLayer.add(lineArrow);
    return lineArrow;
}

// add dotted line connectors
var addBezier = function (id, options) {
    var curveLine = new Kinetic.Line({
        //points: linePoints,
        stroke: options.color,
        strokeWidth: 5,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: false
    });

    // add hover styling
    curveLine.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(6);
        anchorLayer.draw();
    });
    curveLine.on('mouseout', function () {
        document.body.style.cursor = 'default';
        this.setStrokeWidth(5);
        anchorLayer.draw();

    });

    curveLine.on('dragend', function () {
        drawCurves();
        updateDottedLines();
    });

    curveLayer.add(curveLine);

    var newBezier = {

        start: buildAnchor(options.start.x * 2, options.start.y * 2, id),
        control1: buildAnchor(options.control1.x * 2, options.control1.y * 2, id),
        control2: buildAnchor(options.control2.x * 2, options.control2.y * 2, id),
        end: buildAnchor(options.end.x * 2, options.end.y * 2, id),
        bezierLine: buildBezierLine(),
        arrow: buildArrow(options),
        curveLine: curveLine
    };


    bezier[id] = newBezier;
    drawCurves();
    updateDottedLines();
    anchorLayer.draw();
};

function updateBezier(id, options) {
    curve = bezier[id];
    if (options.start !== undefined) {
        curve.start.attrs.x = options.start.x * 2;
        curve.start.attrs.y = options.start.y * 2;
    }
    if (options.control1 !== undefined) {
        curve.control1.attrs.x = options.control1.x * 2;
        curve.control1.attrs.y = options.control1.y * 2;
    }
    if (options.control2 !== undefined) {
        curve.control2.attrs.x = options.control2.x * 2;
        curve.control2.attrs.y = options.control2.y * 2;
    }
    if (options.end !== undefined) {
        curve.end.attrs.x = options.end.x * 2;
        curve.end.attrs.y = options.end.y * 2;
    }
    if (options.color !== undefined) {
        curve.curveLine.attrs.stroke = options.color;
        curve.arrow.attrs.stroke = options.color;
        curve.arrow.attrs.fill = options.color;
    }
    if (options.hasArrow !== undefined) {
        if (options.hasArrow === true) {
            curve.arrow.attrs.opacity = 1;
        } else {
            curve.arrow.attrs.opaticy = 0;
        }
    }
    drawCurves();
    updateDottedLines();
    anchorLayer.draw();
}

Template.viewscreen_tactical.rendered = function () {
    var stage, symbolsLayer, contactsLayer, ghostLayer;
    window.currentDimensions = {
        x: 'x',
        y: 'y',
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

    function transformX(x) {
        //return k.width * ((x * currentDimensions.flippedX) + 1) / 2; // Translate and scale to different coordinate system
        return x * 2;
    }

    function transformY(y) {
        //return k.height * ((y * currentDimensions.flippedY) + 1) / 2; // Flip, translate, and scale to different coordinate system
        return y * 2;
    }

    var armyArray = {};
    var contactsArray = {};
    var labelsArray = {};
    k.center = {
        x: k.width / 2,
        y: k.height / 2
    };

    k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;


    this.subscription = Deps.autorun(function () {
        Meteor.subscribe('cards.card-tacControl.screencontacts', Flint.simulatorId());
    });

    stage = new Kinetic.Stage({
        container: 'tacView',
        width: 1440,
        height: 630
    });

    anchorLayer = new Kinetic.Layer();
    lineLayer = new Kinetic.Layer();
    curveLayer = new Kinetic.Layer();
    contactsLayer = new Kinetic.Layer();
    symbolsLayer = new Kinetic.Layer();
    ghostLayer = new Kinetic.Layer();
    gridLayer = new Kinetic.Layer();
    backgroundLayer = new Kinetic.Layer();
    // keep curves insync with the lines
    anchorLayer.on('beforeDraw', function () {
        drawCurves();
        updateDottedLines();
    });




    var box = new Kinetic.Rect({
        x: 1,
        y: 1,
        width: 1438,
        height: 628,
        fill: 'transparent',
        stroke: 'green',
        strokeWidth: 2
    });
    backgroundLayer.add(box);
    var line;
    for (i = 1; i < 24; i++) {
       line = new Kinetic.Line({
        points: [i * 120, 0, i * 120, 630],
        dash: [20, 10],
        fill: 'green',
        stroke: 'green',
        strokeWidth: 2
    });
       backgroundLayer.add(line);
   }
   for (i = 1; i < 5; i++) {
       line = new Kinetic.Line({
        points: [0, i * 120, 1440, i * 120],
        dash: [20, 10],
        fill: 'green',
        stroke: 'green',
        strokeWidth: 2
    });
       backgroundLayer.add(line);

   }

   this.tacticalObserver = Flint.collection('tacticalscreencontacts').find().observeChanges({
    added: function (id, doc) {
            // console.log("Added", id, doc);
            doc.type = Flint.collection('tacticalscreencontacts').findOne({
                _id: id
            }).type;
            if (doc.type === 'contact') {
                if (!contactsArray[id]) {
                    contactsArray[id] = {};
                    // Draggable Contact
                    var contactObj = new Image();
                    contactObj.onload = function () {
                        var icon = new Kinetic.Image({
                            x: transformX(doc.X),
                            y: transformY(doc.Y),
                            image: contactObj,
                            width: (doc.width * 2),
                            height: (doc.height * 2),
                            red: doc.red,
                            green: doc.green,
                            blue: doc.blue
                        });

                        // Setup filters
                        icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);

                        // add the shape to the layer
                        contactsLayer.add(icon);
                        icon.cache();
                        icon.draw();
                        contactsArray[id].contact = icon;
                    };
                    contactObj.src = doc.icon;
                }
            }
            if (doc.type === 'bezier') {
                if (!bezier[id]) {
                    addBezier(id, doc);
                }
            }
            if (doc.type === 'label') {
                if (!labelsArray[id]) {
                    var label = new Kinetic.Text({
                        x: doc.x * 2,
                        y: doc.y * 2,
                        text: doc.text,
                        fontSize: doc.fontSize * 2,
                        fontFamily: doc.fontFamily,
                        fill: doc.fill,
                        align: doc.align,
                        selected: true,
                        draggable: true
                    });
                    labelsArray[id] = label;
                    contactsLayer.add(label);
                    Session.set('selectedSymbol', id);
                    contactsLayer.draw();
                }
            }
        },
        changed: function (id, fields) {
            fields.type = Flint.collection('tacticalScreenContacts').findOne({
                _id: id
            }).type;
            // console.log("Changed", id, fields);
            if (fields.type === 'contact') {
                var contact = contactsArray[id].contact;

                if (contact) {

                    if (fields.X !== undefined) {
                        contact.setX(transformX(fields.X));
                    }
                    if (fields.Y !== undefined) {
                        contact.setY(transformY(fields.Y));
                    }
                    if (fields.width !== undefined) {
                        contact.attrs.width = (fields.width * 2);
                        contact.attrs.height = (fields.height * 2);
                        contact.cache();

                    }
                    if (fields.red !== undefined) {
                        contact.attrs.red = fields.red;
                        contact.attrs.green = fields.green;
                        contact.attrs.blue = fields.blue;
                        contact.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
                        contact.cache();
                    }
                    contactsLayer.draw();
                }
            }
            if (fields.type === 'bezier') {
                if (bezier[id]) {
                    updateBezier(id, fields);
                }
            }
            if (fields.type === 'label') {
                var label = labelsArray[id];
                if (fields.x !== undefined) {
                    label.setX(fields.x * 2);
                }
                if (fields.y !== undefined) {
                    label.setY(fields.y * 2);
                }
                if (fields.text) {
                    label.text(fields.text);
                }
                if (fields.fontFamily) {
                    label.fontFamily(fields.fontFamily);
                }
                if (fields.fontSize) {
                    label.fontSize(fields.fontSize * 2);
                }
                if (fields.fill) {
                    label.fill(fields.fill);
                }
                contactsLayer.draw();
            }
        },
        removed: function (id) {
            // console.log("Removed", id);
            if (contactsArray.hasOwnProperty(id)) {
                contactsArray[id].contact.remove();
                delete contactsArray[id];
                contactsLayer.draw();
            }
            if (bezier.hasOwnProperty(id)) {
                bezier[id].start.remove();
                bezier[id].control1.remove();
                bezier[id].control2.remove();
                bezier[id].end.remove();
                bezier[id].curveLine.remove();
                bezier[id].bezierLine.remove();
                bezier[id].arrow.remove();
                delete bezier[id];
                curveLayer.draw();
                anchorLayer.draw();
                lineLayer.draw();
            }
            if (labelsArray.hasOwnProperty(id)) {
                labelsArray[id].remove();
                delete labelsArray[id];
                contactsLayer.draw();
            }
        }
    });



stage.add(backgroundLayer);
stage.add(curveLayer);
    stage.add(contactsLayer); // Uppermost layer
};