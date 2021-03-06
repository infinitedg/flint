var scene;
var controls;
var cameras = {};
var animatingObjects = [];
var cameraZoom = 0;
var planetMesh;
var onRenderFcts = [];
var hyperBox;
var laserBeam;
var viewRadius = 30,
viewWidth = 500,
viewHeight = 500;
var hyperBox, boxTexture, hyperLight1, hyperLight2, hyperLight3, hyperLight4;
var Examples;
var curveLayer, lineLayer, anchorLayer, quad, bezier = {};



function loadObject(objModel, objMtl, objTexture, options) {
    //Possible Options:
    //  emissive color
    // scale
    // shininess
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };

    var texture = new THREE.Texture();

    var imageLoader = new THREE.ImageLoader(manager);
    imageLoader.load(objTexture, function(image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    var loader = new THREE.OBJMTLLoader();
    loader.load(objModel, objTexture, function(object) {
        object.scale.multiplyScalar(1 / 10);
        object.traverse(function(object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        return object;
    });

}
Template.viewscreen_sandbox.created = function() {
    this.animating = true;
    this.subscription = Tracker.autorun(function() {
        Meteor.subscribe('cards.card-sensor3d.contacts', Flint.simulatorId());
    });
    Session.set('viewscreen_currentCamera','main');
    this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
        changed: function(id, fields) {
            if (fields.cameraRotationYaw || fields.cameraRotationYaw === 0) {
                if (fields.cameraRotationYaw < 0) {
                    controls.moveState.yawLeft = Math.abs(fields.cameraRotationYaw);
                } else if (fields.cameraRotationYaw > 0) {
                    controls.moveState.yawRight = Math.abs(fields.cameraRotationYaw);
                } else {
                    controls.moveState.yawLeft = 0;
                    controls.moveState.yawRight = 0;
                }
                controls.updateRotationVector();
            }
            if (fields.cameraRotationPitch || fields.cameraRotationPitch === 0) {
                if (fields.cameraRotationPitch < 0) {
                    controls.moveState.pitchUp = Math.abs(fields.cameraRotationPitch);
                } else if (fields.cameraRotationPitch > 0) {
                    controls.moveState.pitchDown = Math.abs(fields.cameraRotationPitch);
                } else {
                    controls.moveState.pitchUp = 0;
                    controls.moveState.pitchDown = 0;
                }
                controls.updateRotationVector();
            }
            if (fields.cameraRotationRoll || fields.cameraRotationRoll === 0) {
                if (fields.cameraRotationRoll < 0) {
                    controls.moveState.rollLeft = Math.abs(fields.cameraRotationRoll);
                } else if (fields.cameraRotationRoll > 0) {
                    controls.moveState.rollRight = Math.abs(fields.cameraRotationRoll);
                } else {
                    controls.moveState.rollLeft = 0;
                    controls.moveState.rollRight = 0;
                }
                controls.updateRotationVector();
            }
            if (fields.cameraZoom || fields.cameraZoom === 0) {
                console.log(fields.cameraZoom);
                cameraZoom = (fields.cameraZoom / 4);
            }
        }
    });
};

Template.viewscreen_sandbox.destroyed = function() {
    this.conditionObserver.stop();
    this.animating = false;
    if (this.sensorObserver) {
        this.sensorObserver.stop();
    }
    if (this.subscription) {
        this.subscription.stop();
    }
};

// Bezier

bezierFunc = function(t, p0, p1, p2, p3) {
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

drawCurves = function() {
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
Template.viewscreen_sandbox.helpers({
    currentCamera:function(){
        Session.set('viewscreen_currentCamera',this.currentCamera);
       // return Session.get('viewscreen_currentCamera');
    }
})

Template.viewscreen_sandbox.rendered = function() {
    debugger;
    Session.setDefault('viewscreen_currentCamera',this.data.currentCamera);
    THREE.ImageUtils.crossOrigin = "";
    var up = new THREE.Vector3(0, 1, 0);
    var clock = new THREE.Clock();
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    // to get smoother output
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('viewscreen').appendChild(renderer.domElement);
    /*Ships Scene*/
    scene = new THREE.Scene();
    window.scene = scene;
    window.camera = cameras;
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.29, 10000);
    cameras.main = (camera);

    for (var i=1; i<=8; i++){
        cameras[i] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);

        cameras[i].position.z = Math.sin(Math.PI/4 * i) * 10;
        cameras[i].position.x = Math.cos(Math.PI/4 * i) * 10;
        cameras[i].lookAt(new THREE.Vector3(0,0,0));
    }
    for (var i=1; i<=4; i++){
        cameras[i+8] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
        cameras[i+8].position.z = Math.sin(Math.PI/2 * i + Math.PI/4) * 10/2;
        cameras[i+8].position.x = Math.cos(Math.PI/2 * i + Math.PI/4) * 10/2;
        cameras[i+8].position.y = 7.5;
        cameras[i+8].lookAt(new THREE.Vector3(0,0,0));


        cameras[i+12] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
        cameras[i+12].position.z = Math.sin(Math.PI/2 * i + Math.PI/4) * 10/2;
        cameras[i+12].position.x = Math.cos(Math.PI/2 * i + Math.PI/4) * 10/2;
        cameras[i+12].position.y = 7.5;
        cameras[i+12].lookAt(new THREE.Vector3(0,0,0));
    }

    controls = new THREE.FlyControls(camera);

    controls.movementSpeed = 2;
    controls.domElement = document.getElementById('viewscreen');
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = 0;
    controls.dragToLook = true;



    var ambientLight = new THREE.AmbientLight(0x020202);
    scene.add(ambientLight);
    var frontLight = new THREE.DirectionalLight('white', 0.5);
    frontLight.position.set(1.5, 1.5, 2);
    scene.add(frontLight);
    var backLight = new THREE.DirectionalLight('white', 0.75);
    backLight.position.set(-1.5, -1.5, -2);
    scene.add(backLight);

    //Star Sphere
    var geometry = new THREE.SphereGeometry(1000, 32, 32);
    var url = '/packages/card-viewscreen/textures/starback.png';
    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(url),
        side: THREE.BackSide
    });
    var starSphere = new THREE.Mesh(geometry, material);
    scene.add(starSphere);


    // lens flares

    var textureFlare0 = THREE.ImageUtils.loadTexture("/packages/card-viewscreen/textures/lensflare/lensflare0.png");
    var textureFlare2 = THREE.ImageUtils.loadTexture("/packages/card-viewscreen/textures/lensflare/lensflare2.png");
    var textureFlare3 = THREE.ImageUtils.loadTexture("/packages/card-viewscreen/textures/lensflare/lensflare3.png");

    addLight(0.55, 0.9, 0.5, -40, 0, -100);
    //addLight( 0.08, 0.8, 0.5,    0, 0, -100 );
    //addLight( 0.995, 0.5, 0.9, 400, 400, -100 );

    function addLight(h, s, l, x, y, z) {

        var light = new THREE.PointLight(0xffffff, 1.5, 4500);
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);
        scene.add(light);

        var flareColor = new THREE.Color(0xffffff);
        flareColor.setHSL(h, s, l + 0.5);

        lensFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);

        lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
        lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
        lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

        lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
        lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

        lensFlare.customUpdateCallback = lensFlareUpdateCallback;
        lensFlare.position.set(light.position.x,light.position.y,light.position.z);

        scene.add(lensFlare);

    }

    function lensFlareUpdateCallback(object) {

        var f, fl = object.lensFlares.length;
        var flare;
        var vecX = -object.positionScreen.x * 2;
        var vecY = -object.positionScreen.y * 2;


        for (f = 0; f < fl; f++) {

            flare = object.lensFlares[f];

            flare.x = object.positionScreen.x + vecX * flare.distance;
            flare.y = object.positionScreen.y + vecY * flare.distance;

            flare.rotation = 0;

        }

        object.lensFlares[2].y += 0.025;
        object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);

    }


    //Planet
    /*var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/models/Planets/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/models/Planets/earthbump1k.jpg'),
        bumpScale: 0.05,
        specularMap: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/models/Planets/earthspec1k.jpg'),
        specular: new THREE.Color('black')
    });
    planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.x = 5;
    planetMesh.position.z = 100;
    planetMesh.scale.x = 20;
    planetMesh.scale.y = 20;
    planetMesh.scale.z = 20;

    //scene.add(planetMesh);*/

    var imageLoader = new THREE.ImageLoader(manager);



    //HyperSpace
    wormhole = new THREE.Object3D();
    hyperLight1 = new THREE.DirectionalLight(0xff8000, 0.75);
    hyperLight1.position.set(1, 1, 70).normalize();
    hyperLight1.visible = false;
    wormhole.add(hyperLight1);
    hyperLight2 = new THREE.DirectionalLight(0xff8000, 0.75);
    hyperLight2.position.set(-1, 1, 70).normalize();
    hyperLight2.visible = false;
    wormhole.add(hyperLight2);
    hyperLight3 = new THREE.PointLight(0x44FFAA, 1, 25);
    hyperLight3.position.set(0, -3, 70);
    hyperLight3.visible = false;
    wormhole.add(hyperLight3);
    hyperLight4 = new THREE.PointLight(0xff4400, 2, 30);
    hyperLight4.position.set(3, 3, 70);
    hyperLight4.visible = false;
    wormhole.add(hyperLight4);

    boxTexture = THREE.ImageUtils.loadTexture("/packages/card-viewscreen/textures/water.jpg");
    boxTexture.wrapT = THREE.RepeatWrapping;
    var boxGeo = new THREE.SphereGeometry(5, 32, 32);
    var PlaneGeo = new THREE.PlaneBufferGeometry(200, 200);
    var boxMat = new THREE.MeshLambertMaterial({
        transparent: true,
        color: 0xFFFFFF,
        map: boxTexture,
        side: THREE.BackSide
    });
    hyperBox = new THREE.Mesh(boxGeo, boxMat);


    hyperBox.name = 'cube';
    hyperBox.position.x = 0;
    hyperBox.position.y = 0;
    hyperBox.position.z = -24;
    hyperBox.scale.y = 5;
    hyperBox.scale.z = 0.5;
    hyperBox.scale.x = 0.5;
    hyperBox.rotateX(Math.PI / 2);
    hyperBox.visible = false;

    var hyperPlane1 = new THREE.Mesh(PlaneGeo, boxMat);
    var hyperPlane2 = new THREE.Mesh(PlaneGeo, boxMat);
    hyperPlane1.position.y = 5;
    hyperPlane2.position.y = -5;
    hyperPlane1.position.z = 20;
    hyperPlane2.position.z = 20;
    hyperPlane1.rotateX((Math.PI / 2) + 0.05);
    hyperPlane2.rotateX((Math.PI / 2) - 0.05);
    hyperPlane1.visible = false;
    hyperPlane2.visible = false;

    scene.add(hyperPlane1);
    scene.add(hyperPlane2);
    wormhole.add(hyperBox);

    //Lens Flare
    var flareColor = new THREE.Color(0xffffff);
    flareColor.setHSL(0.55, 0.8, 0.5 + 0.5);

    hyperFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);

    hyperFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

    hyperFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

    hyperFlare.customUpdateCallback = lensFlareUpdateCallback;
    hyperFlare.position = new THREE.Vector3(0, 0, 10);


    hyperFlare.visible = false;

    geometry = new THREE.PlaneBufferGeometry(10, 10);
    var material1 = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/textures/planar001.png'),
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    var material2 = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/textures/planar002.png'),
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    var material3 = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/textures/planar005.png'),
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    var material4 = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('/packages/card-viewscreen/textures/planar006.png'),
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    wormholeMesh1 = new THREE.Mesh(geometry, material1);
    wormholeMesh2 = new THREE.Mesh(geometry, material2);
    wormholeMesh3 = new THREE.Mesh(geometry, material3);
    wormholeMesh4 = new THREE.Mesh(geometry, material4);

    wormholeMesh1.position.z = -0.7;
    wormholeMesh2.position.z = -0.2;
    wormholeMesh3.position.z = 0;
    wormholeMesh4.position.z = -0.5;
    wormholeMesh1.scale.x = 0.001;
    wormholeMesh1.scale.y = 0.001;
    wormholeMesh2.scale.x = 0.001;
    wormholeMesh2.scale.y = 0.001;
    wormholeMesh3.scale.x = 0.005;
    wormholeMesh3.scale.y = 0.005;
    wormholeMesh4.scale.x = 0.00125;
    wormholeMesh4.scale.y = 0.00125;
    wormholeMesh1.rotateX(0);

    wormhole.add(wormholeMesh1);
    wormhole.add(wormholeMesh2);
    wormhole.add(wormholeMesh3);
    wormhole.add(wormholeMesh4);
    wormhole.position.z = 5;
    wormhole.matrixAutoUpdate = true;
    scene.add(wormhole);

    //    scene.add(wormholeMesh1);
    //    scene.add(wormholeMesh2);
    //    scene.add(wormholeMesh3);
    //    scene.add(wormholeMesh4);

    /*
    window.laserHolder = new THREE.Object3D;
    laserMaker = laserMaker || {}

    laserMaker.LaserBeam    = function(color){
        color = color || 0x4444aa;
        var object3d    = new THREE.Object3D();
        this.object3d   = object3d;
    // generate the texture
    var canvas  = generateLaserBodyCanvas()
    var texture = new THREE.Texture( canvas )
    texture.needsUpdate = true;
    // do the material  
    var material    = new THREE.MeshBasicMaterial({
        map     : texture,
        blending    : THREE.AdditiveBlending,
        color       : color,
        side        : THREE.DoubleSide,
        depthWrite  : false,
        transparent : true
    })
    var geometry    = new THREE.PlaneGeometry(1, 0.05)
    var nPlanes = 16;
    for(var i = 0; i < nPlanes; i++){
        var mesh    = new THREE.Mesh(geometry, material)
        mesh.position.x = 1/2
        mesh.rotation.x = i/nPlanes * Math.PI
        object3d.add(mesh)
    }
    return
    
    function generateLaserBodyCanvas(){
        // init canvas
        var canvas  = document.createElement( 'canvas' );
        var context = canvas.getContext( '2d' );
        canvas.width    = 1;
        canvas.height   = 64;
        // set gradient
        var gradient    = context.createLinearGradient(0, 0, canvas.width, canvas.height);      
        gradient.addColorStop( 0  , 'rgba(  0,  0,  0,0.1)' );
        gradient.addColorStop( 0.1, 'rgba(160,160,160,0.3)' );
        gradient.addColorStop( 0.5, 'rgba(255,255,255,0.5)' );
        gradient.addColorStop( 0.9, 'rgba(160,160,160,0.3)' );
        gradient.addColorStop( 1.0, 'rgba(  0,  0,  0,0.1)' );
        // fill the rectangle
        context.fillStyle   = gradient;
        context.fillRect(0,0, canvas.width, canvas.height);
        // return the just built canvas 
        return canvas;  
    }
    }


    laserBeam = new laserMaker.LaserBeam(0xAB4444);
    var laserCooked = new THREEx.LaserCooked(laserBeam, scene);
    onRenderFcts.push(function (delta, now) {
        laserCooked.update(delta, now);
            //lookTowards(laserBeam.object3d, sceneContacts[laserTarget].position , 1);
        });
    window.laserBeam = laserBeam;
    var object3d = laserBeam.object3d;
    object3d.position.x = 0;
    object3d.position.y = 0.08;
    object3d.position.z = 0.08;
    //object3d.rotation.z = -Math.PI/2      
    onRenderFcts.push(function (delta, now) {
        //var object3d        = laserBeam.object3d
        //object3d.rotation.x = (laserX);          
        //object3d.rotation.z = (laserY);
    });
    window.laserHolder.add(laserBeam);
    scene.add(laserHolder);
    */

    //Ship Textures
    var texture = new THREE.Texture();
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };

    imageLoader.load('/textures/battleship.png', function(image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    var loader = new THREE.OBJMTLLoader();
    loader.load(Flint.a('/Sandbox Models/Battleship'), Flint.a('/Sandbox Materials/Battleship'), function(object) {
        object.scale.multiplyScalar(1 / 15);
        object.traverse(function(object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        object.rotateY(Math.PI);
        battleShip = object;
        scene.add(object);
    });



    window.sceneContacts = {};

    //Sensor Stuff
    this.sensorObserver = Flint.collection('sensorContacts').find().observe({
        added: function(doc) {
            var texture = new THREE.Texture();
            imageLoader.load(Flint.a('/Sandbox Images/' + doc.mesh), function(image) {
                texture.image = image;
                texture.needsUpdate = true;
            });
            if (doc.mesh) {
                loader.load(Flint.a('/Sandbox Models/' + doc.mesh), Flint.a('/Sandbox Materials/' + doc.mesh), function(object) {
                    object.scale.multiplyScalar(1 / 15);
                    object.traverse(function(object3d) {
                        if (object3d.material) {
                            object3d.material.map = texture;
                            object3d.material.emissive.set('white');
                            object3d.material.shininess = 3;
                        }
                    });
                    contact = object;
                    contact.position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
                    scene.add(contact);
                    contact.rotSpeed = 5;
                    sceneContacts[doc._id] = contact;
                    console.log('added');

                });
            }
        },
        changed: function(doc) {
            sceneContacts[doc._id].position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
            sceneContacts[doc._id].target = (new THREE.Vector3(doc.dstX * viewRadius / 2, doc.dstY * viewRadius / 2, doc.dstZ * viewRadius / 2));
        },
        removed: function(doc) {
            scene.remove(sceneContacts[doc._id]);
            delete sceneContacts[doc._id];
        }
    });

    //var Session.get('viewscreen_currentCamera') = camera;
    var currentScene = scene;

    function moveToPoint(fromObject, toPosition, dTheta) {
        fromObject.dx.subVectors(toPosition, fromObject.position);
        if (fromObject.dx.length() > fromObject.closeEnough) {
            var moveDist = dTheta * fromObject.speed;
            fromObject.translateZ(moveDist);
        }
    }
    lookTowards = function(fromObject, toPosition, dTheta) {
        if (fromObject.rotSpeed) {
            dTheta = dTheta * fromObject.rotSpeed;
        } else {
            fromObject.rotSpeed = 5;
            dTheta = dTheta * fromObject.rotSpeed;
        }
        var quat0 = fromObject.quaternion;
        var eye = fromObject.position;
        var center = toPosition;
        if (eye.distanceTo(center) === 0) {
            return false;
        }
        var mat = new THREE.Matrix4();
        mat.lookAt(center, eye, up);
        var quat1 = new THREE.Quaternion();
        quat1.setFromRotationMatrix(mat);
        var deltaTheta = angleBetweenQuats(quat0, quat1);
        var frac = dTheta / deltaTheta;
        if (frac > 1) frac = 1;
        fromObject.quaternion.slerp(quat1, frac);
    };

    function angleBetweenQuats(qBefore, qAfter) {
        q1 = new THREE.Quaternion();
        q1.copy(qBefore);
        q1.inverse();
        q1.multiply(qAfter);
        var halfTheta = Math.acos(q1.w);
        return 2 * halfTheta;
    }
    onRenderFcts.push(function() {
        var delta = clock.getDelta();
        controls.object = cameras[Session.get('viewscreen_currentCamera')];
        //controls.target = scene.position;
        //controls.update();

        controls.update(delta);

        boxTexture.offset.y -= 0.008;
        boxTexture.offset.y %= 1;
        boxTexture.needsUpdate = true;



        var currentZoom = cameras[Session.get('viewscreen_currentCamera')].fov;
        if ((currentZoom += cameraZoom) < 60) {
            currentZoom += cameraZoom;
        }
        if (currentZoom <= 0) {
            currentZoom = 0.1;
        }
        cameras[Session.get('viewscreen_currentCamera')].fov = currentZoom;
        cameras[Session.get('viewscreen_currentCamera')].updateProjectionMatrix();

        for (var prop in sceneContacts) {
            var object = sceneContacts[prop];
            var target = sceneContacts[prop].target;
            if (target && target != object.position) {
                var targetDelta = delta;
                lookTowards(object, target, targetDelta);
            }
        }
        //planetMesh.rotateY(.001);
        wormholeMesh1.rotateZ(-0.05);
        wormholeMesh2.rotateZ(0.01);
        wormholeMesh3.rotateZ(0.05);
        wormholeMesh4.rotateZ(-0.05);

        renderer.render(currentScene, cameras[Session.get('viewscreen_currentCamera')]);

    });


    //initSandbox();
    //initTactical();
    var lastTimeMsec = null;

    function wormholeOpen() {
        //'6'
        //Session.get('viewscreen_currentCamera') = 'main';
        scaleValue = {
            currentValue: 0.001,
            part1Value: 0.001,
            part2Value: 0.001,
            part3Value: 0.001,
            part4Value: 0.001,
            currentPosition: -33,
            hyperBoxOpacity: 0
        };
        hyperBox.visible = false;
        wormhole.position.z = scaleValue.currentPosition;
        wormholeMesh1.scale.x = 0.001;
        wormholeMesh1.scale.y = 0.001;
        wormholeMesh2.scale.x = 0.001;
        wormholeMesh2.scale.y = 0.001;
        wormholeMesh3.scale.x = 0.005;
        wormholeMesh3.scale.y = 0.005;
        wormholeMesh4.scale.x = 0.00125;
        wormholeMesh4.scale.y = 0.00125;
        //wormhole.scale.x = scaleValue.currentValue;
        //wormhole.scale.y = scaleValue.currentValue;
        TweenLite.to(scaleValue, 8, {
            part1Value: 1,
            ease: Elastic.easeOut,
            onUpdate: function() {
                wormholeMesh1.scale.x = scaleValue.part1Value;
                wormholeMesh1.scale.y = scaleValue.part1Value;
            },
            onComplete: function() {
                hyperLight1.visible = true;
                hyperLight2.visible = true;
                hyperLight3.visible = true;
                hyperLight4.visible = true;
                hyperspace = true;
                //scene.add(hyperFlare);
                // hyperBox.visible = true;
                TweenLite.to(scaleValue, 2, {
                    hyperBoxOpacity: 1,
                    onUpdate: function() {
                        hyperBox.visible = true;
                        console.log(scaleValue.hyperBoxOpacity);
                        hyperBox.material.opacity = scaleValue.hyperBoxOpacity;
                    },
                    onComplete: function() {}
                });
            }
        });
TweenLite.to(scaleValue, 4, {
    part2Value: 1,
    delay: 0.5,
    ease: Power4.easeOut,
    onUpdate: function() {
        wormholeMesh2.scale.x = scaleValue.part2Value;
        wormholeMesh2.scale.y = scaleValue.part2Value;
    }
});
TweenLite.to(scaleValue, 6, {
    part3Value: 0.5,
    delay: 0.75,
    ease: Power4.easeOut,
    onUpdate: function() {
        wormholeMesh3.scale.x = scaleValue.part3Value;
        wormholeMesh3.scale.y = scaleValue.part3Value;
    }
});
TweenLite.to(scaleValue, 8, {
    part4Value: 1.25,
    ease: Elastic.easeOut,
    delay: 1,
    onUpdate: function() {
        wormholeMesh4.scale.x = scaleValue.part4Value;
        wormholeMesh4.scale.y = scaleValue.part4Value;
    }
});

TweenLite.to(scaleValue, 12, {
    currentPosition: 3,
    delay: 4,
    ease: Power4.easeInOut,
    onUpdate: function() {
        wormhole.position.z = scaleValue.currentPosition;
    },
    onComplete: function() {

    }
});
}

function wormholeClose() {
        //'5'
        //Session.get('viewscreen_currentCamera') = 'main';
        scaleValue = {
            currentValue: 3,
            part1Value: 1,
            part2Value: 1,
            part3Value: 0.5,
            part4Value: 0.125,
            currentPosition: 0,
            hyperBoxOpacity: 1
        };
        TweenLite.to(scaleValue, 1, {
            hyperBoxOpacity: 0,
            onUpdate: function() {
                hyperBox.material.opacity = scaleValue.hyperBoxOpacity;
            },
            onComplete: function() {
                hyperspace = false;
                hyperBox.visible = false;
            }
        });

        TweenLite.to(cameras[Session.get('viewscreen_currentCamera')], 1, {
            fov: 140,

            onComplete: function() {
                hyperLight1.visible = false;
                hyperLight2.visible = false;
                hyperLight3.visible = false;
                hyperLight4.visible = false;
                scene.remove(hyperFlare);
                //hyperBox.visible = false;
                TweenLite.to(scaleValue, 2, {
                    currentPosition: -3,
                    ease: Power1.easeOut,
                    onUpdate: function() {
                        wormhole.position.z = scaleValue.currentPosition;
                    }
                });
                TweenLite.to(scaleValue, 4, {
                    part1Value: 0.0001,
                    ease: Power1.easeIn,
                    onUpdate: function() {
                        wormholeMesh1.scale.x = scaleValue.part1Value;
                        wormholeMesh1.scale.y = scaleValue.part1Value;
                    }
                });
                TweenLite.to(scaleValue, 4, {
                    part2Value: 0.0001,
                    delay: 0.5,
                    ease: Power1.easeIn,
                    onUpdate: function() {
                        wormholeMesh2.scale.x = scaleValue.part2Value;
                        wormholeMesh2.scale.y = scaleValue.part2Value;
                    }
                });
                TweenLite.to(scaleValue, 6, {
                    part3Value: 0.0001,
                    delay: 0.75,
                    ease: Power1.easeIn,
                    onUpdate: function() {
                        wormholeMesh3.scale.x = scaleValue.part3Value;
                        wormholeMesh3.scale.y = scaleValue.part3Value;
                    }
                });
                TweenLite.to(scaleValue, 6, {
                    part4Value: 0.0001,
                    ease: Power1.easeIn,
                    delay: 1,
                    onUpdate: function() {
                        wormholeMesh4.scale.x = scaleValue.part4Value;
                        wormholeMesh4.scale.y = scaleValue.part4Value;
                    }
                });
                TweenLite.to(cameras[Session.get('viewscreen_currentCamera')], 7, {
                    fov: 45,
                    ease: Expo.easeOut,
                    onUpdate: function() {
                        cameras[Session.get('viewscreen_currentCamera')].updateProjectionMatrix();
                    }
                });
            },
            onUpdate: function() {
                cameras[Session.get('viewscreen_currentCamera')].updateProjectionMatrix();
            }
        });
}
this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
    changed: function(id, fields) {
        if (fields.wormhole) {
            if (fields.wormhole == "true") {
                wormholeOpen();
            } else {
                wormholeClose();
            }
        }
    }
});

laserX = 0;
laserY = 0;

    /*function onKeyDown(evt) {
        var result;
        switch (evt.keyCode) {
            case 72:
                laserBeam.object3d.lookAt(sceneContacts[laserTarget].position);
                break;
            case 74:
                laserX -= 0.05;
                break;
            case 73:
                laserY += 0.05;
                break;
            case 76:
                laserX += 0.05;
                break;
            case 75:
                laserY -= 0.05;
                break;
            case 53:
                wormholeClose();
                break;
            case 54:
                wormholeOpen();
                break;
            case 55:
                // '7'
                Session.get('viewscreen_currentCamera') = 2;
                break;
            case 56:
                // '8'
                Session.get('viewscreen_currentCamera') = 0;
                break;
            case 57:
                // '9'
                Session.get('viewscreen_currentCamera') = 1;
                break;
        }
    }

    window.addEventListener('keydown', onKeyDown, false);*/
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        //  if (Flint.simulator().currentScreen == "Sandbox") {
            onRenderFcts.forEach(function(onRenderFct) {
                onRenderFct(deltaMsec / 1000, nowMsec / 1000);
            });
        //  }
    });
};
