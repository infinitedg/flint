var viewRadius = 100,
viewWidth = 500,
viewHeight = 500;

function debugAxes( length ) {
	function buildAxis( src, dst, colorHex, dashed ) {
	    var geom = new THREE.Geometry(),
	        mat; 

	    if(dashed) {
	            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
	    } else {
	            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	    }

	    geom.vertices.push( src.clone() );
	    geom.vertices.push( dst.clone() );
	    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

	    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

	    return axis;
	};

    var axes = new THREE.Object3D();

    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
	// axes.add( buildHalo( length, 0x0000FF, new THREE.Vector3(0, 1, 0)) );
	// axes.add( buildHalo( length, 0x00FF00, new THREE.Vector3(0, 0, 1)) );
	// axes.add( buildHalo( length, 0xFF0000, new THREE.Vector3(1, 0, 0)) );

    return axes;
};

Template.card_sensor3d.created = function() {
	this.animating = true;
	this.subscription = Deps.autorun(function() {
	    Meteor.subscribe('cards.card-sensor3d.contacts', Flint.simulatorId());
	});
};

Template.card_sensor3d.rendered = function() {
	var onRenderFcts = [];
	// Camera
	var camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.01, 1000 );
	camera.position.z = 130;

	// Scene
	var scene = new THREE.Scene();

	// Debugging Axis
	scene.add(debugAxes(viewRadius / 2));

	// Starfield
	var geometry  = new THREE.SphereGeometry(200, 32, 32);
	var material  = new THREE.MeshBasicMaterial();
	material.map   = THREE.ImageUtils.loadTexture('/packages/card-sensor3d/stars.png');
	material.side  = THREE.BackSide;
	var mesh  = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// Renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( viewWidth, viewHeight );
	this.find('.sensor_box').appendChild( renderer.domElement );

	// Mouse Controls
	var mouse	= {x : 0, y : 0}
	$('.sensor_box canvas').on('mousemove', function(){
		mouse.x	= (event.clientX / $('.sensor_box canvas').width() ) - 0.5;
		mouse.y	= (event.clientY / $('.sensor_box canvas').height()) - 0.5;
	});
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*10 - camera.position.x) * (delta*3);
		camera.position.y += (mouse.y*10 - camera.position.y) * (delta*3);
		camera.lookAt( scene.position );
	});
	
	// controls = new THREE.TrackballControls( camera );

	// controls.rotateSpeed = 1.0;
	// controls.zoomSpeed = 1.2;
	// controls.panSpeed = 0.8;

	// controls.noZoom = true;
	// controls.noPan = true;

	// controls.staticMoving = true;
	// controls.dynamicDampingFactor = 0.3;

	// controls.keys = [ 65, 83, 68 ];

	// controls.addEventListener( 'change', function() {
	// 	renderer.render(scene, camera);
	// });

	// onRenderFcts.push(function() {
	// 	controls.update();
	// });

	// Animation Function
	onRenderFcts.push(function(){
		renderer.render( scene, camera );
	});

	var lastTimeMsec= null
	var that = this;
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		if (that.animating) {
			requestAnimationFrame( animate );
		}
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
		lastTimeMsec	= nowMsec;
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		});
	});

	var sceneSprites = {};
	this.sensorObserver = Flint.collection('sensorContacts').find().observe({
		added: function(doc) {
			var sprite = THREE.ImageUtils.loadTexture( "/packages/card-sensorGrid/sprites/" + doc.icon );

			var material = new THREE.SpriteMaterial( { map: sprite, useScreenCoordinates: false, color: 0x00ff00 } );
			var sprite = new THREE.Sprite( material );
			sprite.position.set( doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
			sprite.scale.set( 0.05 * viewRadius, 0.05 * viewRadius, 1.0 );
			scene.add( sprite );

			sceneSprites[doc._id] = sprite;
		}, changed: function(doc) {
			sceneSprites[doc._id].position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
		}, removed: function(doc) {
			scene.remove(sceneSprites[doc._id]);
			delete sceneSprites[doc._id];
		}
	})
};

Template.card_sensor3d.destroyed = function() {
	this.animating = false;
	this.sensorObserver.stop();
	this.subscription.stop();
};