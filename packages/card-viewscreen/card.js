var scene;
var controls;
var cameras = [];
var animatingObjects = [];
var currentCamera = 0;
var cameraZoom = 0;
var planetMesh;
var viewRadius = 20,
viewWidth = 500,
viewHeight = 500;
var particleEngine;
var Examples;
Template.card_viewscreen.scene = function () {
    return scene;
};
Template.card_viewscreen.examples = function() {
    return Examples;
};
Template.card_viewscreen.particleEngine = function() {
    return hyperEngine;
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

Template.card_viewscreen.rendered = function () {
    //Particle Engine

    /**
* @author Lee Stemkoski   http://www.adelphi.edu/~stemkoski/
*/

///////////////////////////////////////////////////////////////////////////////

/////////////
// SHADERS //
/////////////

// attribute: data that may be different for each particle (such as size and color);
//      can only be used in vertex shader
// varying: used to communicate data from vertex shader to fragment shader
// uniform: data that is the same for each particle (such as texture)

particleVertexShader =
[
"attribute vec3  customColor;",
"attribute float customOpacity;",
"attribute float customSize;",
"attribute float customAngle;",
"attribute float customVisible;",  // float used as boolean (0 = false, 1 = true)
"varying vec4  vColor;",
"varying float vAngle;",
"void main()",
"{",
	"if ( customVisible > 0.5 )", 				// true
		"vColor = vec4( customColor, customOpacity );", //     set color associated to vertex; use later in fragment shader.
	"else",							// false
		"vColor = vec4(0.0, 0.0, 0.0, 0.0);", 		//     make particle invisible.

	"vAngle = customAngle;",

	"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
	"gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );",     // scale particles as objects in 3D space
	"gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");

particleFragmentShader =
[
"uniform sampler2D texture;",
"varying vec4 vColor;",
"varying float vAngle;",
"void main()",
"{",
	"gl_FragColor = vColor;",

	"float c = cos(vAngle);",
	"float s = sin(vAngle);",
	"vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,",
	                      "c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);",  // rotate UV coordinates to rotate texture
    	"vec4 rotatedTexture = texture2D( texture,  rotatedUV );",
	"gl_FragColor = gl_FragColor * rotatedTexture;",    // sets an otherwise white particle texture to desired color
"}"
].join("\n");

///////////////////////////////////////////////////////////////////////////////

/////////////////
// TWEEN CLASS //
/////////////////

function Tween(timeArray, valueArray)
{
	this.times  = timeArray || [];
	this.values = valueArray || [];
}

Tween.prototype.lerp = function(t)
{
	var i = 0;
	var n = this.times.length;
	while (i < n && t > this.times[i])
		i++;
	if (i == 0) return this.values[0];
	if (i == n)	return this.values[n-1];
	var p = (t - this.times[i-1]) / (this.times[i] - this.times[i-1]);
	if (this.values[0] instanceof THREE.Vector3)
		return this.values[i-1].clone().lerp( this.values[i], p );
	else // its a float
		return this.values[i-1] + p * (this.values[i] - this.values[i-1]);
}

///////////////////////////////////////////////////////////////////////////////

////////////////////
// PARTICLE CLASS //
////////////////////

function Particle()
{
	this.position     = new THREE.Vector3();
	this.velocity     = new THREE.Vector3(); // units per second
	this.acceleration = new THREE.Vector3();

	this.angle             = 0;
	this.angleVelocity     = 0; // degrees per second
	this.angleAcceleration = 0; // degrees per second, per second

	this.size = 16.0;

	this.color   = new THREE.Color();
	this.opacity = 1.0;

	this.age   = 0;
	this.alive = 0; // use float instead of boolean for shader purposes
}

Particle.prototype.update = function(dt)
{
	this.position.add( this.velocity.clone().multiplyScalar(dt) );
	this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );

	// convert from degrees to radians: 0.01745329251 = Math.PI/180
	this.angle         += this.angleVelocity     * 0.01745329251 * dt;
	this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

	this.age += dt;

	// if the tween for a given attribute is nonempty,
	//  then use it to update the attribute's value

	if ( this.sizeTween.times.length > 0 )
		this.size = this.sizeTween.lerp( this.age );

	if ( this.colorTween.times.length > 0 )
	{
		var colorHSL = this.colorTween.lerp( this.age );
		this.color = new THREE.Color().setHSL( colorHSL.x, colorHSL.y, colorHSL.z );
	}

	if ( this.opacityTween.times.length > 0 )
		this.opacity = this.opacityTween.lerp( this.age );
}

///////////////////////////////////////////////////////////////////////////////

///////////////////////////
// PARTICLE ENGINE CLASS //
///////////////////////////

var ParticleType = Object.freeze({ "CUBE":1, "SPHERE":2 });

function ParticleEngine()
{
	/////////////////////////
	// PARTICLE PROPERTIES //
	/////////////////////////

	this.positionStyle = ParticleType.CUBE;
	this.positionBase   = new THREE.Vector3();
	// cube shape data
	this.positionSpread = new THREE.Vector3();
	// sphere shape data
	this.positionRadius = 0; // distance from base at which particles start

	this.velocityStyle = ParticleType.CUBE;
	// cube movement data
	this.velocityBase       = new THREE.Vector3();
	this.velocitySpread     = new THREE.Vector3();
	// sphere movement data
	//   direction vector calculated using initial position
	this.speedBase   = 0;
	this.speedSpread = 0;

	this.accelerationBase   = new THREE.Vector3();
	this.accelerationSpread = new THREE.Vector3();

	this.angleBase               = 0;
	this.angleSpread             = 0;
	this.angleVelocityBase       = 0;
	this.angleVelocitySpread     = 0;
	this.angleAccelerationBase   = 0;
	this.angleAccelerationSpread = 0;

	this.sizeBase   = 0.0;
	this.sizeSpread = 0.0;
	this.sizeTween  = new Tween();

	// store colors in HSL format in a THREE.Vector3 object
	// http://en.wikipedia.org/wiki/HSL_and_HSV
	this.colorBase   = new THREE.Vector3(0.0, 1.0, 0.5);
	this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
	this.colorTween  = new Tween();

	this.opacityBase   = 1.0;
	this.opacitySpread = 0.0;
	this.opacityTween  = new Tween();

	this.blendStyle = THREE.NormalBlending; // false;

	this.particleArray = [];
	this.particlesPerSecond = 100;
	this.particleDeathAge = 1.0;

	////////////////////////
	// EMITTER PROPERTIES //
	////////////////////////

	this.emitterAge      = 0.0;
	this.emitterAlive    = true;
	this.emitterDeathAge = 60; // time (seconds) at which to stop creating particles.

	// How many particles could be active at any time?
	this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );

	//////////////
	// THREE.JS //
	//////////////

	this.particleGeometry = new THREE.Geometry();
	this.particleTexture  = null;
	this.particleMaterial = new THREE.ShaderMaterial(
	{
		uniforms:
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		attributes:
		{
			customVisible:	{ type: 'f',  value: [] },
			customAngle:	{ type: 'f',  value: [] },
			customSize:		{ type: 'f',  value: [] },
			customColor:	{ type: 'c',  value: [] },
			customOpacity:	{ type: 'f',  value: [] }
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5,
		blending: THREE.NormalBlending, depthTest: true,

	});
	this.particleMesh = new THREE.Mesh();
}

ParticleEngine.prototype.setValues = function( parameters )
{
	if ( parameters === undefined ) return;

	// clear any previous tweens that might exist
	this.sizeTween    = new Tween();
	this.colorTween   = new Tween();
	this.opacityTween = new Tween();

	for ( var key in parameters )
		this[ key ] = parameters[ key ];

	// attach tweens to particles
	Particle.prototype.sizeTween    = this.sizeTween;
	Particle.prototype.colorTween   = this.colorTween;
	Particle.prototype.opacityTween = this.opacityTween;

	// calculate/set derived particle engine values
	this.particleArray = [];
	this.emitterAge      = 0.0;
	this.emitterAlive    = true;
	this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );

	this.particleGeometry = new THREE.Geometry();
	this.particleMaterial = new THREE.ShaderMaterial(
	{
		uniforms:
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		attributes:
		{
			customVisible:	{ type: 'f',  value: [] },
			customAngle:	{ type: 'f',  value: [] },
			customSize:		{ type: 'f',  value: [] },
			customColor:	{ type: 'c',  value: [] },
			customOpacity:	{ type: 'f',  value: [] }
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true,  alphaTest: 0.5, // if having transparency issues, try including: alphaTest: 0.5,
		blending: THREE.NormalBlending, depthTest: true
	});
	this.particleMesh = new THREE.ParticleSystem();
}

// helper functions for randomization
ParticleEngine.prototype.randomValue = function(base, spread)
{
	return base + spread * (Math.random() - 0.5);
}
ParticleEngine.prototype.randomVector3 = function(base, spread)
{
	var rand3 = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
	return new THREE.Vector3().addVectors( base, new THREE.Vector3().multiplyVectors( spread, rand3 ) );
}


ParticleEngine.prototype.createParticle = function()
{
	var particle = new Particle();

	if (this.positionStyle == ParticleType.CUBE)
		particle.position = this.randomVector3( this.positionBase, this.positionSpread );
	if (this.positionStyle == ParticleType.SPHERE)
	{
		var z = 2 * Math.random() - 1;
		var t = 6.2832 * Math.random();
		var r = Math.sqrt( 1 - z*z );
		var vec3 = new THREE.Vector3( r * Math.cos(t), r * Math.sin(t), z );
		particle.position = new THREE.Vector3().addVectors( this.positionBase, vec3.multiplyScalar( this.positionRadius ) );
	}

	if ( this.velocityStyle == ParticleType.CUBE )
	{
		particle.velocity     = this.randomVector3( this.velocityBase,     this.velocitySpread );
	}
	if ( this.velocityStyle == ParticleType.SPHERE )
	{
		var direction = new THREE.Vector3().subVectors( particle.position, this.positionBase );
		var speed     = this.randomValue( this.speedBase, this.speedSpread );
		particle.velocity  = direction.normalize().multiplyScalar( speed );
	}

	particle.acceleration = this.randomVector3( this.accelerationBase, this.accelerationSpread );

	particle.angle             = this.randomValue( this.angleBase,             this.angleSpread );
	particle.angleVelocity     = this.randomValue( this.angleVelocityBase,     this.angleVelocitySpread );
	particle.angleAcceleration = this.randomValue( this.angleAccelerationBase, this.angleAccelerationSpread );

	particle.size = this.randomValue( this.sizeBase, this.sizeSpread );

	var color = this.randomVector3( this.colorBase, this.colorSpread );
	particle.color = new THREE.Color().setHSL( color.x, color.y, color.z );

	particle.opacity = this.randomValue( this.opacityBase, this.opacitySpread );

	particle.age   = 0;
	particle.alive = 0; // particles initialize as inactive

	return particle;
}

ParticleEngine.prototype.initialize = function()
{
	// link particle data with geometry/material data
	for (var i = 0; i < this.particleCount; i++)
	{
		// remove duplicate code somehow, here and in update function below.
		this.particleArray[i] = this.createParticle();
		this.particleGeometry.vertices[i] = this.particleArray[i].position;
		this.particleMaterial.attributes.customVisible.value[i] = this.particleArray[i].alive;
		this.particleMaterial.attributes.customColor.value[i]   = this.particleArray[i].color;
		this.particleMaterial.attributes.customOpacity.value[i] = this.particleArray[i].opacity;
		this.particleMaterial.attributes.customSize.value[i]    = this.particleArray[i].size;
		this.particleMaterial.attributes.customAngle.value[i]   = this.particleArray[i].angle;
	}

	this.particleMaterial.blending = this.blendStyle;
	if ( this.blendStyle != THREE.NormalBlending)
		this.particleMaterial.depthTest = false;

	this.particleMesh = new THREE.ParticleSystem( this.particleGeometry, this.particleMaterial );
	this.particleMesh.dynamic = true;
	this.particleMesh.sortParticles = true;
	scene.add( this.particleMesh );
}

ParticleEngine.prototype.update = function(dt)
{
	var recycleIndices = [];

	// update particle data
	for (var i = 0; i < this.particleCount; i++)
	{
		if ( this.particleArray[i].alive )
		{
			this.particleArray[i].update(dt);

			// check if particle should expire
			// could also use: death by size<0 or alpha<0.
			if ( this.particleArray[i].age > this.particleDeathAge )
			{
				this.particleArray[i].alive = 0.0;
				recycleIndices.push(i);
			}
			// update particle properties in shader
			this.particleMaterial.attributes.customVisible.value[i] = this.particleArray[i].alive;
			this.particleMaterial.attributes.customColor.value[i]   = this.particleArray[i].color;
			this.particleMaterial.attributes.customOpacity.value[i] = this.particleArray[i].opacity;
			this.particleMaterial.attributes.customSize.value[i]    = this.particleArray[i].size;
			this.particleMaterial.attributes.customAngle.value[i]   = this.particleArray[i].angle;
		}
	}

	// check if particle emitter is still running
	if ( !this.emitterAlive ) return;

	// if no particles have died yet, then there are still particles to activate
	if ( this.emitterAge < this.particleDeathAge )
	{
		// determine indices of particles to activate
		var startIndex = Math.round( this.particlesPerSecond * (this.emitterAge +  0) );
		var   endIndex = Math.round( this.particlesPerSecond * (this.emitterAge + dt) );
		if  ( endIndex > this.particleCount )
			  endIndex = this.particleCount;

		for (var i = startIndex; i < endIndex; i++)
			this.particleArray[i].alive = 1.0;
	}

	// if any particles have died while the emitter is still running, we imediately recycle them
	for (var j = 0; j < recycleIndices.length; j++)
	{
		var i = recycleIndices[j];
		this.particleArray[i] = this.createParticle();
		this.particleArray[i].alive = 1.0; // activate right away
		this.particleGeometry.vertices[i] = this.particleArray[i].position;
	}

	// stop emitter?
	this.emitterAge += dt;
//	if ( this.emitterAge > this.emitterDeathAge )  this.emitterAlive = false;
}

ParticleEngine.prototype.destroy = function()
{
    scene.remove( this.particleMesh );
}
///////////////////////////////////////////////////////////////////////////////

//Examples
Examples =
{

    clouds :
    {
        positionStyle  : ParticleType.CUBE,
        positionBase   : new THREE.Vector3( -100, 100,  0 ),
        positionSpread : new THREE.Vector3(    0,  50, 60 ),

        velocityStyle  : ParticleType.CUBE,
        velocityBase   : new THREE.Vector3( 40, 0, 0 ),
        velocitySpread : new THREE.Vector3( 20, 0, 0 ),

        //particleTexture : THREE.ImageUtils.loadTexture( 'images/smokeparticle.png'),

        sizeBase     : 80.0,
        sizeSpread   : 100.0,
        colorBase    : new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
        opacityTween : new Tween([0,1,4,5],[0,1,1,0]),

        particlesPerSecond : 50,
        particleDeathAge   : 10.0,
        emitterDeathAge    : 60
    },

    starfield :
    {
        positionStyle    : ParticleType.CUBE,
        positionBase     : new THREE.Vector3( 0, 200, 0 ),
        positionSpread   : new THREE.Vector3( 600, 400, 600 ),

        velocityStyle    : ParticleType.CUBE,
        velocityBase     : new THREE.Vector3( 0, 0, 0 ),
        velocitySpread   : new THREE.Vector3( 0.5, 0.5, 0.5 ),

        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       : 0,
        angleVelocitySpread     : 4,

        particleTexture : THREE.ImageUtils.loadTexture( '/packages/card-viewscreen/textures/spikey.png' ),

        sizeBase    : 10.0,
        sizeSpread  : 2.0,
        colorBase   : new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
        colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
        opacityBase : 1,

        particlesPerSecond : 20000,
        particleDeathAge   : 60.0,
        emitterDeathAge    : 0.1
    },
    startunnel :
    {
        positionStyle  : ParticleType.CUBE,
        positionBase   : new THREE.Vector3( 0, 0, 100),
        positionSpread : new THREE.Vector3( 10, 10, 10 ),

        velocityStyle  : ParticleType.CUBE,
        velocityBase   : new THREE.Vector3( 0, 0, -200 ),
        velocitySpread : new THREE.Vector3( 40, 40, 80 ),

        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       : 10,
        angleVelocitySpread     : 0,

        particleTexture : THREE.ImageUtils.loadTexture( '/packages/card-viewscreen/textures/spikey.png' ),

        sizeBase    : 4.0,
        sizeSpread  : 2.0,
        colorBase   : new THREE.Vector3(0.15, 1.0, 0.8), // H,S,L
        opacityBase : 1,
        blendStyle  : THREE.AdditiveBlending,

        particlesPerSecond : 100,
        particleDeathAge   : 2.0,
        emitterDeathAge    : 60
    }

}



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


    var onRenderFcts = [];

    var ambientLight = new THREE.AmbientLight(0x020202);
    scene.add(ambientLight);
    var frontLight	= new THREE.DirectionalLight('white', 0.5);
	frontLight.position.set(0.5, 0.5, 2);
	scene.add( frontLight );
	var backLight	= new THREE.DirectionalLight('white', 0.75);
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
    var hyperLight1	= new THREE.DirectionalLight( 0xff8000, .75 );
    hyperLight1.position.set( 1, 1, 0 ).normalize();
    hyperLight1.visible = false;
    scene.add( hyperLight1 );
    var hyperLight2	= new THREE.DirectionalLight( 0xff8000, .75 );
    hyperLight2.position.set( -1, 1, 0 ).normalize();
    hyperLight2.visible = false;
    scene.add( hyperLight2 );
    var hyperLight3	= new THREE.PointLight( 0x44FFAA, 1, 25 );
    hyperLight3.position.set( 0, -3, 0 );
    hyperLight3.visible = false;
    scene.add( hyperLight3 );
    var hyperLight4	= new THREE.PointLight( 0xff4400, 2, 30 );
    hyperLight4.position.set( 3, 3, 0 );
    hyperLight4.visible = false;
    scene.add( hyperLight4 );

    var boxTexture		= THREE.ImageUtils.loadTexture( "/packages/card-viewscreen/textures/water.jpg" );
    boxTexture.wrapT	= THREE.RepeatWrapping;
    var boxGeo = new THREE.SphereGeometry(5, 32, 32);
    var PlaneGeo = new THREE.PlaneGeometry(200,200);
    var boxMat = new THREE.MeshLambertMaterial({color : 0xFFFFFF, map : boxTexture, side: THREE.DoubleSide});
    var hyperBox = new THREE.Mesh(boxGeo,boxMat);


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

    //Particle System Engine
    particleEngine = new ParticleEngine();
	particleEngine.setValues( Examples.startunnel );

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
     function onKeyDown(evt) {
    var result;
    switch (evt.keyCode) {
      case 49: // '1'
        hvyCruiserShip.target = new THREE.Vector3(0,0,0);
        break;
      case 50: // '2'
        hvyCruiserShip.target = new THREE.Vector3(.25,-.25,4);
        break;
      case 51: // '3'
        hvyCruiserShip.target = new THREE.Vector3(-4,1,0);
        break;
      case 53: //'5'
              hyperspace = false;
            hyperLight1.visible = false;
            hyperLight2.visible = false;
            hyperLight3.visible = false;
            hyperLight4.visible = false;
            scene.remove(hyperFlare);
            hyperEngine.destroy();
            hyperEngine = {};
            hyperBox.visible = false;
        break;
      case 54: //'6'
            hyperLight1.visible = true;
            hyperLight2.visible = true;
            hyperLight3.visible = true;
            hyperLight4.visible = true;
            scene.add(hyperFlare);
            hyperEngine = new ParticleEngine();
            hyperEngine.setValues( Examples.startunnel );
            hyperEngine.initialize();
            hyperBox.visible = true;
            hyperspace = true;
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
    onRenderFcts.push(function () {
        var delta = clock.getDelta();
            controls.object = cameras[currentCamera];
            //controls.target = scene.position;
            //controls.update();

            controls.update(delta);

            boxTexture.offset.y	+= 0.008;
			boxTexture.offset.y	%= 1;
			boxTexture.needsUpdate	= true;



        var currentZoom = cameras[currentCamera].fov;
        if (!(currentZoom += cameraZoom > 60)) {currentZoom += cameraZoom}
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
        if (hyperspace) {hyperEngine.update( delta);}
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
