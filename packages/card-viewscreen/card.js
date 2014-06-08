var scene;
var controls;
var cameras = [];
var animatingObjects = [];
var currentCamera = 0;
var cameraZoom = 0;
var planetMesh;
var onRenderFcts = [];
var viewRadius = 20,
viewWidth = 500,
viewHeight = 500;
var hyperBox, boxTexture, hyperLight1, hyperLight2, hyperLight3, hyperLight4;
var Examples;
Template.card_viewscreen.scene = function () {
    return scene;
};
Template.card_viewscreen.examples = function() {
    return Examples;
};
Template.card_viewscreen.controls = function () {
    return controls;
};
Template.card_viewscreen.currentCamera = function (num) {
    if (num){
    currentCamera = num;
    }
    return currentCamera;

};
Template.card_viewscreen.cameras = function() {
  return cameras;
};

function loadObject(objModel, objMtl, objTexture, options) {
    //Possible Options:
    //  emissive color
    // scale
    // shininess
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var texture = new THREE.Texture();

    var imageLoader = new THREE.ImageLoader(manager);
    imageLoader.load(objTexture, function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    var loader = new THREE.OBJMTLLoader();
    loader.load(objModel, objTexture, function (object) {
        object.scale.multiplyScalar(1 / 10);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        return object;
    });

}
Template.card_viewscreen.created = function () {
    this.animating = true;
    this.subscription = Deps.autorun(function() {
        Meteor.subscribe('cards.card-sensor3d.contacts', Flint.simulatorId());
    });
    this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
        changed: function (id, fields) {
            if (fields.currentScreen == 'Sandbox'){
                $('#viewscreen').removeClass('hidden');
                $('#tacView').addClass('hidden');
            }
            if (fields.currentScreen == 'Tactical'){
                $('#tacView').removeClass('hidden');
                $('#viewscreen').addClass('hidden');
            }
            if (fields.cameraRotationYaw || fields.cameraRotationYaw == 0) {
                if (fields.cameraRotationYaw < 0){
                controls.moveState.yawLeft = Math.abs(fields.cameraRotationYaw);
                } else if(fields.cameraRotationYaw > 0) {
                 controls.moveState.yawRight = Math.abs(fields.cameraRotationYaw);
                } else {
                    controls.moveState.yawLeft = 0;
                  controls.moveState.yawRight = 0;
                }
                controls.updateRotationVector();
            }
            if (fields.cameraRotationPitch || fields.cameraRotationPitch == 0) {
                if (fields.cameraRotationPitch < 0){
                controls.moveState.pitchUp = Math.abs(fields.cameraRotationPitch);
                } else if(fields.cameraRotationPitch > 0) {
                 controls.moveState.pitchDown = Math.abs(fields.cameraRotationPitch);
                } else {
                  controls.moveState.pitchUp = 0;
                  controls.moveState.pitchDown = 0;
                }
                controls.updateRotationVector();
            }
            if (fields.cameraRotationRoll || fields.cameraRotationRoll == 0) {
                if (fields.cameraRotationRoll < 0){
                    controls.moveState.rollLeft = Math.abs(fields.cameraRotationRoll);
                } else if(fields.cameraRotationRoll > 0) {
                    controls.moveState.rollRight = Math.abs(fields.cameraRotationRoll);
                } else {
                  controls.moveState.rollLeft = 0;
                  controls.moveState.rollRight = 0;
                }
                controls.updateRotationVector();
            }
            if (fields.cameraZoom || fields.cameraZoom ==0) {
            	console.log(fields.cameraZoom)
                cameraZoom = (fields.cameraZoom/4);
            }
        }
    });
};

Template.card_viewscreen.destroyed = function () {
    this.conditionObserver.stop();
    this.animating = false;
    if (this.sensorObserver) {
        this.sensorObserver.stop();
    }
    if (this.subscription) {
        this.subscription.stop();
    }
};

function initSandbox(){
    var up = new THREE.Vector3(0,1,0);
    var clock = new THREE.Clock();
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    }); // to get smoother output});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('viewscreen').appendChild(renderer.domElement);
    /*Ships Scene*/
    scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.29, 10000);
    camera.position.z = 1;
    cameras.push(camera);

    var camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera1.position.z = 5;
    cameras.push(camera1);
    //controls = new THREE.OrbitControls( camera );

    camera.position.z = 0;
    camera.rotateY(Math.PI);
    controls = new THREE.FlyControls(camera);

    controls.movementSpeed = 0;
    controls.domElement = document.getElementById('viewscreen');
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;



    var ambientLight = new THREE.AmbientLight(0x020202);
    scene.add(ambientLight);
    var frontLight  = new THREE.DirectionalLight('white', 0.5);
    frontLight.position.set(0.5, 0.5, 2);
    scene.add( frontLight );
    var backLight   = new THREE.DirectionalLight('white', 0.75);
    backLight.position.set(-0.5, -0.5, -2);
    scene.add( backLight );

    var geometry = new THREE.SphereGeometry(1000, 32, 32);
    var url = '/packages/card-viewscreen/models/starback.png';
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

    addLight(0.55, 0.9, 0.5, -40, 0, 100);
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
        lensFlare.position = light.position;

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
    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
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

    scene.add(planetMesh);

    //Ship Textures
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var texture = new THREE.Texture();
    var imageLoader = new THREE.ImageLoader(manager);
    imageLoader.load('/packages/card-viewscreen/models/Battleship/battleship_elements2_c.png', function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    var loader = new THREE.OBJMTLLoader();
    loader.load('/packages/card-viewscreen/models/Battleship/_1.obj', '/packages/card-viewscreen/models/Battleship/_1.mtl', function (object) {
        object.scale.multiplyScalar(1 / 15);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        battleShip = object;
        scene.add(object);
    });
    loader.load('/packages/card-viewscreen/models/AstraHeavyCruiser/_1.obj', '/packages/card-viewscreen/models/AstraHeavyCruiser/_1.mtl', function (object)     {
        object.scale.multiplyScalar(1 / 2);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        object.position.x = 0.25;
        hvyCruiserShip = object;
        scene.add(object);
        object.rotSpeed = 2.5;
        object.speed = 0.5;
        object.closeEnough = 0.1;
        object.dx = new THREE.Vector3();
        animatingObjects.push(object);
    });

    //HyperSpace
    hyperLight1 = new THREE.DirectionalLight( 0xff8000, .75 );
    hyperLight1.position.set( 1, 1, 0 ).normalize();
    hyperLight1.visible = false;
    scene.add( hyperLight1 );
    hyperLight2 = new THREE.DirectionalLight( 0xff8000, .75 );
    hyperLight2.position.set( -1, 1, 0 ).normalize();
    hyperLight2.visible = false;
    scene.add( hyperLight2 );
    hyperLight3 = new THREE.PointLight( 0x44FFAA, 1, 25 );
    hyperLight3.position.set( 0, -3, 0 );
    hyperLight3.visible = false;
    scene.add( hyperLight3 );
    hyperLight4 = new THREE.PointLight( 0xff4400, 2, 30 );
    hyperLight4.position.set( 3, 3, 0 );
    hyperLight4.visible = false;
    scene.add( hyperLight4 );

    boxTexture      = THREE.ImageUtils.loadTexture( "/packages/card-viewscreen/textures/water.jpg" );
    boxTexture.wrapT    = THREE.RepeatWrapping;
    var boxGeo = new THREE.SphereGeometry(5, 32, 32);
    var PlaneGeo = new THREE.PlaneGeometry(200,200);
    var boxMat = new THREE.MeshLambertMaterial({color : 0xFFFFFF, map : boxTexture, side: THREE.DoubleSide});
    hyperBox = new THREE.Mesh(boxGeo,boxMat);


    hyperBox.name = 'cube';
    hyperBox.position.x = 0;
    hyperBox.position.y = 0;
    hyperBox.position.z = 10;
    hyperBox.scale.y = 15;
    hyperBox.rotateX(Math.PI/2);
    hyperBox.visible = false;

    var hyperPlane1 = new THREE.Mesh(PlaneGeo,boxMat);
    var hyperPlane2 = new THREE.Mesh(PlaneGeo,boxMat);
    hyperPlane1.position.y = 5;
    hyperPlane2.position.y = -5;
    hyperPlane1.position.z = 20;
    hyperPlane2.position.z = 20;
    hyperPlane1.rotateX((Math.PI/2)+.05);
    hyperPlane2.rotateX((Math.PI/2)-.05);
    hyperPlane1.visible = false;
    hyperPlane2.visible = false;

    scene.add(hyperPlane1);
    scene.add(hyperPlane2);
    scene.add(hyperBox);

    //Lens Flare
    var flareColor = new THREE.Color(0xffffff);
    flareColor.setHSL(.55, .8, .5 + 0.5);

    hyperFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);

    hyperFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

    hyperFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
    hyperFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

    hyperFlare.customUpdateCallback = lensFlareUpdateCallback;
    hyperFlare.position = new THREE.Vector3(0,0,10);


    hyperFlare.visible = false;

    window.sceneContacts = {};


    //Sensor Stuff
    this.sensorObserver = Flint.collection('sensorContacts').find().observe({
        added: function(doc) {
            imageLoader.load('/packages/card-viewscreen/models/Battleship/battleship_elements2_c.png', function (image) {
                texture.image = image;
                texture.needsUpdate = true;
            });
            if (doc.mesh) {
            loader.load('/packages/card-viewscreen/models/' + doc.mesh + '/_1.obj', '/packages/card-viewscreen/models/' + doc.mesh + '/_1.mtl', function (object) {
                object.scale.multiplyScalar(1);
                object.traverse(function (object3d) {
                    if (object3d.material) {
                        object3d.material.map = texture;
                        object3d.material.emissive.set('white');
                        object3d.material.shininess = 3;
                    }
                });
                contact = object;
                contact.position.set( doc.x * viewRadius/2, doc.y * viewRadius/2, doc.z * viewRadius / 2);
                scene.add(contact);
                contact.rotSpeed = 5;
                sceneContacts[doc._id] = contact;
                console.log('added');

            });
        }
        }, changed: function(doc) {
            sceneContacts[doc._id].position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
            sceneContacts[doc._id].target = (new THREE.Vector3(doc.dstX * viewRadius / 2, doc.dstY * viewRadius/2, doc.dstZ * viewRadius/2));
        }, removed: function(doc) {
            scene.remove(sceneContacts[doc._id]);
            delete sceneContacts[doc._id];
        }
    })
    var currentScene = scene;
    //var currentCamera = camera;
    function moveToPoint(fromObject, toPosition, dTheta) {
        fromObject.dx.subVectors(toPosition,fromObject.position);
        if (fromObject.dx.length() > fromObject.closeEnough) {
            var moveDist = dTheta*fromObject.speed;
            fromObject.translateZ(moveDist);
        }
    }
    function lookTowards(fromObject, toPosition, dTheta) {
        if (fromObject.rotSpeed){dTheta = dTheta * fromObject.rotSpeed;}
        var quat0 = fromObject.quaternion;
        var eye = fromObject.position;
        var center = toPosition;
        debugger;
        if (eye == center){return false;}
        var mat = new THREE.Matrix4();
        mat.lookAt(center,eye,up);
        var quat1 = new THREE.Quaternion();
        quat1.setFromRotationMatrix( mat );
        var deltaTheta = angleBetweenQuats(quat0,quat1);
        var frac = dTheta/deltaTheta;
        if (frac>1)  frac=1;
        fromObject.quaternion.slerp(quat1,frac);
    }
    function angleBetweenQuats(qBefore,qAfter) {
        q1 = new THREE.Quaternion();
        q1.copy(qBefore);
        q1.inverse();
        q1.multiply(qAfter);
        var halfTheta = Math.acos( q1.w );
        return 2*halfTheta;
    }
    onRenderFcts.push(function () {
        var delta = clock.getDelta();
        controls.object = cameras[currentCamera];
        //controls.target = scene.position;
        //controls.update();

        controls.update(delta);

        boxTexture.offset.y += 0.008;
        boxTexture.offset.y %= 1;
        boxTexture.needsUpdate  = true;

        var currentZoom = cameras[currentCamera].fov;
        if ((currentZoom += cameraZoom) < 60) {currentZoom += cameraZoom;}
        if (currentZoom <= 0) {currentZoom = 0.1;}
        cameras[currentCamera].fov = currentZoom;
        cameras[currentCamera].updateProjectionMatrix()

        for (prop in sceneContacts){
            var object = sceneContacts[prop];
            var target = sceneContacts[prop].target;
            if (target && target != object.position){
                var targetDelta = delta;
                lookTowards(object, target, targetDelta);
            }
        }
        planetMesh.rotateY(.01);
        renderer.render(currentScene, cameras[currentCamera]);

    });

    
};

function initTactical(){
    var stage,symbolsLayer,contactsLayer,ghostLayer;

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
      return x*2;
    };

    function transformY(y) {
      //return k.height * ((y * currentDimensions.flippedY) + 1) / 2; // Flip, translate, and scale to different coordinate system
      return y*2;
    };

    var armyArray = {};
    var contactsArray = {};

    k.center = {
      x: k.width / 2,
      y: k.height / 2
    };

    k.radius = (k.width / 2 < k.height / 2) ? k.width / 2 - k.strokeWidth : k.height / 2 - k.strokeWidth;


    this.subscription = Deps.autorun(function() {
        Meteor.subscribe('cards.card-tacControl.contacts', Flint.simulatorId());
      });

      stage = new Kinetic.Stage({
            container: 'tacView',
            width: 1440,
            height: 630
          });

          

               contactsLayer = new Kinetic.Layer();
               symbolsLayer = new Kinetic.Layer();
              ghostLayer = new Kinetic.Layer();
              backgroundLayer = new Kinetic.Layer();


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

          for (i=1; i<24; i++){
            var line = new Kinetic.Line({
            points: [i*120,0,i*120,630],
            dash: [20,10],
            fill: 'green',
            stroke: 'green',
            strokeWidth: 2
          });
            backgroundLayer.add(line);
          }
          for (i=1; i<5; i++){
             var line = new Kinetic.Line({
            points: [0,i*120,1440,i*120],
            dash: [20, 10],
            fill: 'green',
            stroke: 'green',
            strokeWidth: 2
          });
            backgroundLayer.add(line);

          }

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
                image: contactObj,
                width: (doc['width']*2),
                 height: (doc['height']*2),
                red: k.filter.red,
                green: k.filter.green,
                blue: k.filter.blue
              });

              // Setup filters
              icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);

              // add the shape to the layer
              contactsLayer.add(icon);
              icon.cache();
              icon.draw();
              contactsArray[id].contact = icon;
            };
            contactObj.src = k.spritePath + doc.icon;
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
            if (fields['width'] !== undefined){
                debugger;
                contact.attrs.width = (fields['width']*2);
                contact.attrs.height = (fields['height']*2);
                contact.cache();

            }
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

              

      stage.add(backgroundLayer);
      stage.add(contactsLayer); // Uppermost layer
};
Template.card_viewscreen.rendered = function () {
    initSandbox();
    initTactical();
    var lastTimeMsec = null;
    function onKeyDown(evt) {
        var result;
        switch (evt.keyCode) {
          case 53: //'5'
            currentCamera = 0;
            
            TweenLite.to(cameras[currentCamera], 1, {fov:179, onComplete: function(){
                hyperLight1.visible = false;
            hyperLight2.visible = false;
            hyperLight3.visible = false;
            hyperLight4.visible = false;
            scene.remove(hyperFlare);
            hyperBox.visible = false;
            hyperspace = false;
            TweenLite.to(cameras[currentCamera], 7, {fov:45, ease: Expo.easeOut, onUpdate: function(){cameras[currentCamera].updateProjectionMatrix();}});},
            onUpdate: function(){cameras[currentCamera].updateProjectionMatrix();}});
            
            break;
          case 54: //'6'
          currentCamera = 0;
            TweenLite.to(cameras[currentCamera],12, {fov:179, ease: Expo.easeIn, onComplete:function(){
            hyperLight1.visible = true;
            hyperLight2.visible = true;
            hyperLight3.visible = true;
            hyperLight4.visible = true;
            scene.add(hyperFlare);
            hyperBox.visible = true;
            hyperspace = true;
            TweenLite.to(cameras[currentCamera], 3, {fov:45, 
            onUpdate: function(){cameras[currentCamera].updateProjectionMatrix();}});},
            onUpdate: function(){cameras[currentCamera].updateProjectionMatrix();}});


            break;
          case 56: // '8'
            currentCamera = 0;
            break;
          case 57: // '9'
            currentCamera = 1;
            break;
        }
    }

  window.addEventListener('keydown', onKeyDown, false);
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        if (Flint.simulator().currentScreen == "Sandbox") {
            onRenderFcts.forEach(function (onRenderFct) {
                onRenderFct(deltaMsec / 1000, nowMsec / 1000);
            });
        } 
    });
};
