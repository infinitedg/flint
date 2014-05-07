var scene;
var controls;
var cameras = [];
var currentCamera = 0;
Template.card_viewscreen.scene = function () {
    return scene;
};
Template.card_viewscreen.controls = function () {
    return controls;
};
Template.card_viewscreen.currentCamera = function (num) {
    currentCamera = num;
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
    this.conditionObserver = Flint.collection('simulators').find(Flint.simulatorId()).observeChanges({
        changed: function (id, fields) {
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
        }
    });
};

Template.card_viewscreen.destroyed = function () {
    this.conditionObserver.stop();
};

Template.card_viewscreen.rendered = function () {

    var clock = new THREE.Clock();
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    }); // to get smoother output});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('viewscreen').appendChild(renderer.domElement);
    /*Ships Scene*/
    scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.z = 1;
    cameras.push(camera);

    var camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera1.position.z = -5;
    cameras.push(camera1);
    //controls = new THREE.OrbitControls( camera );

    camera.position.z = 5;

    controls = new THREE.FlyControls(camera);

    controls.movementSpeed = 0;
    controls.domElement = document.getElementById('viewscreen');
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;



    var onRenderFcts = [];

    var ambientLight = new THREE.AmbientLight(0x020202);
    scene.add(ambientLight);
    /*var frontLight	= new THREE.DirectionalLight('white', 1);
	frontLight.position.set(0.5, 0.5, 2);
	scene.add( frontLight );
	var backLight	= new THREE.DirectionalLight('white', 0.75);
	backLight.position.set(-0.5, -0.5, -2);
	scene.add( backLight );*/

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

        var lensFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);

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
    var planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.x = 5;
    planetMesh.position.z = -100;
    planetMesh.scale.x = 20;
    planetMesh.scale.y = 20;
    planetMesh.scale.z = 20;

    scene.add(planetMesh);


    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var texture = new THREE.Texture();

    var imageLoader = new THREE.ImageLoader(manager);
    imageLoader.load('/packages/card-viewscreen/models/astra_elements2_c.png', function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    var loader = new THREE.OBJMTLLoader();
    loader.load('/packages/card-viewscreen/models/battleship.obj', '/packages/card-viewscreen/models/battleship.mtl', function (object) {
        object.scale.multiplyScalar(1 / 10);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        battleShip = object;
        object.rotateY(Math.PI / 2);
        scene.add(object);
    });
    imageLoader.load('/packages/card-viewscreen/models/AstraShuttle/astra_elements1_c.png', function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    object = [];
    loader.load('/packages/card-viewscreen/models/AstraShuttle/_1.obj', '/packages/card-viewscreen/models/AstraShuttle/_1.mtl', function (object) {
        object.scale.multiplyScalar(1 / 10);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        object.position.x = -0.5;
        object.rotateY(Math.PI / 2);
        shuttleShip = object;
        scene.add(object);
    });
    object = [];
    loader.load('/packages/card-viewscreen/models/AstraLightCruiser/_1.obj', '/packages/card-viewscreen/models/AstraLightCruiser/_1.mtl', function (object) {
        object.scale.multiplyScalar(1 / 5);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        object.position.x = 0.5;
        object.rotateY(Math.PI / 2);
        ltCruiserShip = object;
        scene.add(object);
    });
    object = [];
    loader.load('/packages/card-viewscreen/models/AstraHeavyCruiser/_1.obj', '/packages/card-viewscreen/models/AstraHeavyCruiser/_1.mtl', function (object) {
        object.scale.multiplyScalar(1 / 2);
        object.traverse(function (object3d) {
            if (object3d.material) {
                object3d.material.map = texture;
                object3d.material.emissive.set('white');
                object3d.material.shininess = 3;
            }
        });
        object.position.x = 0.25;
        object.rotateY(Math.PI / 2);
        hvyCruiserShip = object;
        scene.add(object);
    });


    var currentScene = scene;
    //var currentCamera = camera;
    onRenderFcts.push(function () {
        if (currentScene == scene) {
            controls.object = cameras[currentCamera];
            //controls.target = scene.position;
            //controls.update();

            var delta = clock.getDelta();
            controls.update(delta);
            //  planetMesh.rotateY(.005);
        } else {
            // move the texture to give the illusion of moving thru the tunnel
            //	tunnelTexture.offset.y	+= 0.008;
            //	tunnelTexture.offset.y	%= 1;
            //		tunnelTexture.needsUpdate	= true;

            /*	// move the camera back and forth
			var seconds		= Date.now() / 1000;
			var radius		= 0.70;
			var angle		= Math.sin(0.75 * seconds * Math.PI) / 4;
			//angle	= (seconds*Math.PI)/4;
			tunnelCamera.position.x	= Math.cos(angle - Math.PI/2) * radius;
			tunnelCamera.position.y	= Math.sin(angle - Math.PI/2) * radius;
			tunnelCamera.rotation.z	= angle;*/
        }
        // debugger;
        renderer.render(currentScene, cameras[currentCamera]);

    });
    var lastTimeMsec = null;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        onRenderFcts.forEach(function (onRenderFct) {
            onRenderFct(deltaMsec / 1000, nowMsec / 1000);
        });
    });
};