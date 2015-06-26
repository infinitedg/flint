var viewRadius = 100,
viewWidth = 580,
viewHeight = 580;

function pausecomp(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {}
}

function ping() {
    $('.sensor_box').removeClass('animating');
    //The Following use of setTimeout is necessary, becasue Meteor
    //Doesn't like doing timeouts when it comes to updating the
    //Local Cache.
    setTimeout(function () {
        $('.sensor_box').addClass('animating');
    }, 200);
}

Template.sonarControl.helpers({
    currentSensor: function (sensor) {
        if (Flint.system('Sensors','pingInterval') && Flint.system('Sensors','pingInterval').period == 5000) {
            return 'active';
        } else if (Flint.system('Sensors','pingInterval') && Flint.system('Sensors','pingInterval').period == 10000) {
            return 'passive';
        } else {
            return 'manual';
        }
    }
});

Template.card_sensor3d.helpers({
    infaredSensors: function (context) {

        if (context == 'button') {
            if (Flint.system('Sensors','infrared') == 'true') {
                return 'DEACTIVATE';
            } else {
                return 'ACTIVATE';
            }
        }
        if (context == 'class') {
            if (Flint.system('Sensors','infrared') == 'true') {
                console.log('on');
                return 'infared';
            } else {
                console.log('off');
                return '';
            }
        }
    }
});

Template.card_sensor3d.events = {
    'mousemove .sensorLabel': function () {
        $('.sensorLabel').removeClass('shown');
    },
    'click #infared': function () {
        Flint.beep();
        if (Flint.system('Sensors','infrared') == 'true') {
            Flint.system('Sensors','infrared', 'false');
        } else {
            Flint.system('Sensors','infrared', 'true');
        }
    }

};
Template.sonarControl.events = {
    'click #ping': function () {
        Flint.beep();
        var setter = {
            triggered: 'manual',
            period: Date.now()
        };
        Flint.system('Sensors','pingInterval',setter);
        $("#ping").attr('disabled', 'disabled');
        Meteor.setTimeout(function () {
            $("#ping").removeAttr('disabled');
        }, 3000);
    },
    'click #activeScan': function () {
        Flint.beep();
        var setter = {
            updated: 'true',
            triggered: Date.now(),
            period: 5000
        };
        Flint.system('Sensors','pingInterval', setter);
    },
    'click #passiveScan': function () {
        Flint.beep();
        var setter = {
            updated: 'true',
            triggered: Date.now(),
            period: 10000
        };
        Flint.system('Sensors','pingInterval', setter);
    },
    'click #manualScan': function () {
        Flint.beep();
        var setter = {
            triggered: 'manual',
            period: 'manual'
        };
        Flint.system('Sensors','pingInterval', setter);
    }
};

function buildAxis(src, dst, colorHex, dashed) {
    var geom = new THREE.Geometry(),
    mat;

    if (dashed) {
        mat = new THREE.LineDashedMaterial({
            linewidth: 3,
            color: colorHex,
            dashSize: 3,
            gapSize: 3
        });
    } else {
        mat = new THREE.LineBasicMaterial({
            linewidth: 3,
            color: colorHex
        });
    }

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line(geom, mat, THREE.LinePieces);

    return axis;
}

function buildHalo(radius, color, axis) {
    var segments = 64,
    material = new THREE.LineBasicMaterial({
        color: color
    }),
    geometry = new THREE.CircleGeometry(radius, segments);
    geometry.vertices.shift();
    var l = new THREE.Line(geometry, material);
    l.rotateOnAxis(axis, Math.PI / 2);
    return l;
}

function debugAxes(length) {
    var axes = new THREE.Object3D();

    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
    axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

    axes.add(buildHalo(length, 0x0000FF, new THREE.Vector3(0, 0, 1)));
    return axes;
}


function shipDiagram() {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, -1));
    geometry.vertices.push(new THREE.Vector3(0.5, 0, 0.5));
    geometry.vertices.push(new THREE.Vector3(0, 0.25, 0));
    geometry.vertices.push(new THREE.Vector3(-0.5, 0, 0.5));
    geometry.vertices.push(new THREE.Vector3(0, -0.25, 0));

    geometry.faces.push(new THREE.Face3(0, 2, 1));
    geometry.faces.push(new THREE.Face3(0, 3, 2));
    geometry.faces.push(new THREE.Face3(0, 1, 4));
    geometry.faces.push(new THREE.Face3(0, 4, 3));
    geometry.faces.push(new THREE.Face3(2, 4, 1));
    geometry.faces.push(new THREE.Face3(2, 3, 4));

    var material = new THREE.MeshPhongMaterial({
        wireframe: true,
        color: 0xCCCCCC
    });
    var ship = new THREE.Mesh(geometry, material);
    ship.scale.x = 3;
    ship.scale.y = 3;
    ship.scale.z = 3;
    return ship;
}
Template.card_sensor3d.created = function () {
    this.animating = true;
    this.subscription = Deps.autorun(function () {
        Meteor.subscribe('cards.card-sensor3d.contacts', Flint.simulatorId());
    });
};

function toScreenXY(position, camera, div) {
    var pos = position.clone();
    projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    //projScreenMat.multiplyVector3( pos );
    pos.applyProjection(projScreenMat);

    var offset = findOffset(div);

    return {
        x: (pos.x + 1) * div.width / 2 + offset.left,
        y: (-pos.y + 1) * div.height / 2 + offset.top
    };

}

function findOffset(element) {
    var pos = {};
    pos.left = pos.top = 0;
    if (element.offsetParent) {
        do {
            pos.left += element.offsetLeft;
            pos.top += element.offsetTop;
        } while (element == element.offsetParent);
    }
    return pos;
}

Template.card_sensor3d.rendered = function () {
    THREE.ImageUtils.crossOrigin = "";

    var sensorLabelOffset = $('.sensorLabel').offset();
    var onRenderFcts = [];
    var mouseVector = new THREE.Vector3();
    var projector = new THREE.Projector();
    // Camera
    var camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.01, 1000);
    camera.position.z = 130;
    camera.position.y = 90;

    // Scene
    var scene = new THREE.Scene();

    // Debugging Axis
    //scene.add(debugAxes(viewRadius / 2));

    //Ship Diagram
    scene.add(shipDiagram());

    var light = new THREE.AmbientLight(0xaaaaaa); // soft white light
    scene.add(light);

    // Starfield
    // var geometry  = new THREE.SphereGeometry(200, 32, 32);
    // var material  = new THREE.MeshBasicMaterial();
    // material.map   = THREE.ImageUtils.loadTexture('/packages/card-sensor3d/stars.png');
    // material.side  = THREE.BackSide;
    // var mesh  = new THREE.Mesh(geometry, material);
    //scene.add(mesh);

    // Renderer
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        clearColor: 0xff0000,
        clearAlpha: 1
    });
    renderer.setSize(viewWidth, viewHeight);
    //renderer.setClearColorHex( 0xffffff, 0);
    this.find('.sensor_box').appendChild(renderer.domElement);
    var canvasElement = this.find('.sensor_box canvas');
    // Mouse Controls
    /*
	var mouse	= {x : 0, y : 0}
	$('.sensor_box canvas').on('mousemove', function(){
		mouse.x	= (event.clientX / $('.sensor_box canvas').width() ) - 0.5;
		mouse.y	= (event.clientY / $('.sensor_box canvas').height()) - 0.5;
	});
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*10 - camera.position.x) * (delta*3);
		camera.position.y += (mouse.y*10 - camera.position.y) * (delta*3);
		camera.lookAt( scene.position );
	});*/
$('.sensor_box').on('mousemove', function () {
    e = event;
    mouseVector.x = 2 * (e.offsetX / viewWidth) - 1;
    mouseVector.y = 1 - 2 * (e.offsetY / viewHeight);
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseVector.clone(), camera),
    intersects = raycaster.intersectObjects(scene.children);

        /*scene.children.forEach(function( cube ) {
        if (cube.material){
            cube.material.color.setRGB( 0, 1, 0 );}
        });*/
$('.sensorLabel').removeClass('shown');
if (Flint.system('Sensors','infrared') != "true") {
    for (var i = 0; i < intersects.length; i++) {
        var intersection = intersects[i],
        obj = intersection.object;
                //obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
                var position = obj.position;
                if (obj.material.opacity > 0.5) {
                    $('.sensorLabel').addClass('shown');
                    $('#contactImage').attr('src', Flint.a('/Sensor Pictures/' + obj.picture));
                    $('.sensorLabel').css('top', (toScreenXY(obj.position, camera, canvasElement)).y  - 10);
                    $('.sensorLabel').css('left', (toScreenXY(obj.position, camera, canvasElement)).x  + 30);
                    $('.sensorLabel p').text(obj.name);

                }
            }
        }
    });
controls = new THREE.OrbitControls(camera, $('.sensor_box')[0]);
controls.noZoom = true;
controls.noPan = true;

    /*controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;


	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [ 65, 83, 68 ];

	controls.addEventListener( 'change', function() {
		renderer.render(scene, camera);
	});*/

onRenderFcts.push(function () {
    controls.update();
});

    // "Radar" axes
    var radar_x = new THREE.Object3D(),
    radar_y = new THREE.Object3D(),
    radar_z = new THREE.Object3D(),
    radar_length = viewRadius / 2,
    radar_rotation_speed = 0.01;

    //radar_x.add(buildHalo( radar_length, 0xFF0000, new THREE.Vector3(1, 0, 0))); // +X
    //radar_y.add(buildHalo( radar_length, 0x00FF00, new THREE.Vector3(0, 1, 0))); // +Y
    //radar_z.add(buildHalo( radar_length, 0x0000FF, new THREE.Vector3(0, 0, 1))); // +Z

    //radar_x.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( radar_length, 0, 0 ), 0xFF0000, false ) ); // +X
    //radar_x.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -radar_length, 0, 0 ), 0xFF0000, true) ); // -X

    // radar_y.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, radar_length, 0 ), 0x00FF00, false ) ); // +Y
    // radar_y.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -radar_length, 0 ), 0x00FF00, true ) ); // -Y

    // radar_z.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, radar_length ), 0x0000FF, false ) ); // +Z
    // radar_z.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -radar_length ), 0x0000FF, true ) ); // -Z

    /*
	scene.add(radar_x);
	scene.add(radar_y);
	scene.add(radar_z);

	onRenderFcts.push(function() {
		radar_x.rotation.x = radar_x.rotation.x + radar_rotation_speed;
		radar_x.rotation.y = radar_x.rotation.y + radar_rotation_speed;
		radar_x.rotation.z = radar_x.rotation.z + radar_rotation_speed;

		radar_y.rotation.x = radar_y.rotation.x + radar_rotation_speed;
		radar_y.rotation.y = radar_y.rotation.y + radar_rotation_speed;
		radar_y.rotation.z = radar_y.rotation.z + radar_rotation_speed;

		radar_z.rotation.x = radar_z.rotation.x + radar_rotation_speed;
		radar_z.rotation.y = radar_z.rotation.y + radar_rotation_speed;
		radar_z.rotation.z = radar_z.rotation.z + radar_rotation_speed;
	});*/

    // Animation Function
    onRenderFcts.push(function () {
        renderer.render(scene, camera);
    });

    var lastTimeMsec = null;
    var that = this;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        if (that.animating) {
            requestAnimationFrame(animate);
        }
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        onRenderFcts.forEach(function (onRenderFct) {
            onRenderFct(deltaMsec / 1000, nowMsec / 1000);
        });
    });

    window.sceneSprites = {};

    var spriteOpacity = function (sprite, calculatedOpacity) {
        var x = sprite.position.x * 2 / viewRadius,
        y = sprite.position.y * 2 / viewRadius,
        z = sprite.position.z * 2 / viewRadius,
        d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)),
        opacity;
        if (d > 0.9) {
            opacity = (1 - d) / 0.1;
            if (opacity < 0) {
                opacity = 0;
            }
        } else {
            opacity = 1;
        }
        calculatedOpacity = calculatedOpacity;
        opacity = (opacity * calculatedOpacity);
        return opacity;
    };

    var spriteTransparent = function (sprite) {
        return (sprite.material.opacity == 1);
    };

    this.conditionObserver = Flint.collection('systems').find({'simulatorId':'voyager','name':'Sensors'}).observeChanges({
        changed: function (id, fields) {
            if (fields.pingInterval) {
                ping();
            }
            if (fields.infaredSensors) {
                var spriteColor, sprite;
                for (var key in sceneSprites) {
                    var obj = sceneSprites[key];
                    var doc = Flint.collection('sensorContacts').findOne(key);
                    if (fields.infaredSensors == 'true') {
                        if (!doc.infared) {
                            obj.visible = false;
                        } else {
                            obj.visible = true;
                            doc.color = "#f00";
                            spriteColor = new THREE.Color(doc.color);
                            sprite = THREE.ImageUtils.loadTexture(Flint.a('/Sensor Icons/Infared'));

                            sceneSprites[doc._id].material.map = sprite;
                            sceneSprites[doc._id].material.color = spriteColor;
                        }
                    } else {
                        if (doc.hasOwnProperty('infaredContact')) {
                            obj.visible = false;
                        } else {
                            obj.visible = doc.isVisible;
                            doc = Flint.collection('sensorContacts').findOne(key);
                            doc.color = "#0f0";
                            spriteColor = new THREE.Color(doc.color);
                            sprite = THREE.ImageUtils.loadTexture(Flint.a('/Sensor Icons/' + doc.icon));

                            sceneSprites[doc._id].material.map = sprite;
                            sceneSprites[doc._id].material.color = spriteColor;
                        }
                    }

                }
            }
        }
    });

loadTexture = function(url, uniform, cb){
    var image = document.createElement( 'img' );
    image.crossOrigin = '';
    var texture = new THREE.Texture( image );
    image.onload = function()  {
        texture.needsUpdate = true;
        uniform.value = texture;
        if (typeof(cb) !== 'undefined'){
            cb(this);
        }
    };
    image.src = url;
};

function loadImage(path) {
  var canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  //document.body.appendChild(canvas);

  var texture = new THREE.Texture(canvas);

  var img = new Image();
  img.crossOrigin = '';
  img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;

      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);

      texture.needsUpdate = true;
  };
  img.src = path;
  return texture;
};



this.sensorObserver = Flint.collection('sensorContacts').find().observe({
    added: function (doc) {
        var spriteColor;
        var sprite;
            //doc.color = "#0f0";
            if (Flint.system('Sensors','infrared') == "true") {
                spriteColor = new THREE.Color('#f00');
                sprite = THREE.ImageUtils.loadTexture(Flint.a('/Sensor Icons/Infared'));
            } else {
                spriteColor = doc.color || '#fff';
                spriteColor = new THREE.Color(spriteColor);
                sprite = THREE.ImageUtils.loadTexture(Flint.a('/Sensor Icons/' + doc.icon));
              // sprite = loadImage(Flint.a('/Sensor Icons/' + doc.icon));
           }
           var material = new THREE.SpriteMaterial({
            map: sprite,
            useScreenCoordinates: false,
            color: spriteColor
        });
           sprite = new THREE.Sprite(material);
           if (Flint.system('Sensors','infrared') == "true") {
            if (!doc.infared) {
                sprite.visible = false;
            }
        } else {
            if (doc.infaredContact) {
                sprite.visible = false;
            }
        }
        sprite.position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
        sprite.scale.set(0.05 * viewRadius, 0.05 * viewRadius, 1.0);
        sprite.material.opacity = spriteOpacity(sprite,doc.opacity);
        sprite.material.transparent = spriteTransparent(sprite);
        sprite.picture = doc.picture;
        sprite.name = doc.name;
        scene.add(sprite);

        sceneSprites[doc._id] = sprite;
    },
    changed: function (doc, oldDoc) {
        var color;
        if (Flint.system('Sensors','infrared') == "true") {
            color = "#f00";
        } else {
            color = doc.color;
        }
        if (doc.icon != oldDoc.icon) {
            var sprite;
            if (Flint.system('Sensors','infrared') == "true") {
                sprite = loadImage(Flint.a('/Sensor Icons/Infared'));
            } else {
                sprite = loadImage(Flint.a('/Sensor Icons/' + doc.icon));
            }
            sceneSprites[doc._id].material.map = sprite;
        }
        sceneSprites[doc._id].material.color = new THREE.Color(color);
        sceneSprites[doc._id].name = doc.name;
        sceneSprites[doc._id].picture = doc.picture;
        sceneSprites[doc._id].position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
        sceneSprites[doc._id].material.opacity = spriteOpacity(sceneSprites[doc._id], doc.opacity);
        sceneSprites[doc._id].material.transparent = spriteTransparent(sceneSprites[doc._id]);
    },
    removed: function (doc) {
        scene.remove(sceneSprites[doc._id]);
        delete sceneSprites[doc._id];
    }
});
};

Template.card_sensor3d.destroyed = function () {
    this.animating = false;
    if (this.sensorObserver) {
        this.sensorObserver.stop();
    }
    if (this.subscription) {
        this.subscription.stop();
    }
};
