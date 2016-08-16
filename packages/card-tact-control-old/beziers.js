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

updateDottedLines = function () {
    for (var curveid in bezier) {
        var b = bezier[curveid];
        var bezierLine = b.bezierLine;
        bezierLine.setPoints([b.start.attrs.x, b.start.attrs.y, b.control1.attrs.x, b.control1.attrs.y, b.control2.attrs.x, b.control2.attrs.y, b.end.attrs.x, b.end.attrs.y]);
    }
    // }; 
    lineLayer.draw();
};

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

buildBezierLine = function () {
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


buildAnchor = function (x, y, id) {
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

    // add hover styling
    anchor.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        anchorLayer.draw();
    });
    anchor.on('mouseout', function () {
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        anchorLayer.draw();

    });
    anchor.on('dragstart', function () {
        Session.set('selectedSymbol', id);
    });
    anchor.on('dragend', function () {
        drawCurves();
        updateDottedLines();
        var curve = bezier[this.attrs.parentid];
        var updateObj = {
            start: {
                x: curve.start.attrs.x,
                y: curve.start.attrs.y
            },
            control1: {
                x: curve.control1.attrs.x,
                y: curve.control1.attrs.y
            },
            control2: {
                x: curve.control2.attrs.x,
                y: curve.control2.attrs.y
            },
            end: {
                x: curve.end.attrs.x,
                y: curve.end.attrs.y
            }
        };
        var removeBezier = false;
        for (var part in updateObj) {
            var position = updateObj[part];
            if (position.x > 660 && position.x < 720 && position.y > 305 && position.y < 380) {
                removeBezier = true;
                console.log('In Trash');
            }
        }
        if (removeBezier) {
            Flint.collection('tacticalContacts').remove(id);
            Session.set('selectedSymbol', '');
        } else {
            Flint.collection('tacticalContacts').update(id, {
                $set: updateObj
            });
        }
        /*}*/
    });

    anchorLayer.add(anchor);
    return anchor;
};

buildArrow = function (options) {
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
};

// add dotted line connectors
addBezier = function (id, options) {

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

updateBezier = function (id, options) {
    curve = bezier[id];
    if (options.start !== undefined) {
        curve.start.attrs.x = options.start.x;
        curve.start.attrs.y = options.start.y;
    }
    if (options.control1 !== undefined) {
        curve.control1.attrs.x = options.control1.x;
        curve.control1.attrs.y = options.control1.y;
    }
    if (options.control2 !== undefined) {
        curve.control2.attrs.x = options.control2.x;
        curve.control2.attrs.y = options.control2.y;
    }
    if (options.end !== undefined) {
        curve.end.attrs.x = options.end.x;
        curve.end.attrs.y = options.end.y;
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
};