var mouseX = 0, mouseY = 0;
Template.card_sensor3d.created = function() {
	this.subscription = Deps.autorun(function() {
	    Meteor.subscribe('cards.card-sensor3d.contacts', Flint.simulatorId());
	});
};

Template.card_sensor3d.rendered = function() {
	var that = this;

	that.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 1000 );
	that.camera.position.z = 500;

	that.scene = new THREE.Scene();

	function buildAxes( length ) {
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
		axes.add( buildHalo( length, 0x0000FF, new THREE.Vector3(1, 0, 0)) );

        return axes;
	};

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
	}

	function buildHalo(length, color, vect) {
		var material = new THREE.LineBasicMaterial({
        	linewidth: 3,
			color: 0x00ff00
		});

		var radius = length;
		var segments = 32;

		var circleGeometry = new THREE.CircleGeometry( radius, segments );
		circleGeometry.vertices.shift();
		var circle = new THREE.Line( circleGeometry, material );

		rotateAroundWorldAxis(circle, vect, Math.PI / 180);

		return circle;
	}

	// Rotate an object around an arbitrary axis in object space
	var rotObjectMatrix;
	function rotateAroundObjectAxis(object, axis, radians) {
	    rotObjectMatrix = new THREE.Matrix4();
	    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
	    object.matrix.multiply(rotObjectMatrix);
	    object.rotation.setEulerFromRotationMatrix(object.matrix);
	}

	var rotWorldMatrix;
	// Rotate an object around an arbitrary axis in world space       
	function rotateAroundWorldAxis(object, axis, radians) {
	    rotWorldMatrix = new THREE.Matrix4();
	    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	    rotWorldMatrix.multiply(object.matrix);
	    object.matrix = rotWorldMatrix;
	    object.rotation.setFromRotationMatrix(object.matrix);
	}

	var axes = buildAxes( 500 );
	that.scene.add(axes);

	that.renderer = new THREE.WebGLRenderer();
	that.renderer.setSize( window.innerWidth, window.innerHeight );
	that.find('.sensor_box').appendChild( that.renderer.domElement );

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	$('.sensor_box canvas').on('mousedown.card_sensor3d', function(){
		$('body').on('mousemove.card_sensor3d', function(event) {
			mouseX = event.clientX - windowHalfX;
			mouseY = event.clientY - windowHalfY;
		}).one('mouseup.card_sensor3d', function() {
			$('body').off('mousemove.card_sensor3d');
		})
	});

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {

		var time = Date.now() * 0.00005;

		that.camera.position.x += ( mouseX - that.camera.position.x ) * 0.05;
		that.camera.position.y += ( - mouseY - that.camera.position.y ) * 0.05;

		that.camera.lookAt( that.scene.position );

		// h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
		// that.material.color.setHSL( h, 0.5, 0.5 );

		that.renderer.render( that.scene, that.camera );
	}

	animate();

	that.sceneSprites = {};
	that.sensorObserver = Flint.collection('sensorContacts').find().observe({
		added: function(doc) {
			that.sprite = THREE.ImageUtils.loadTexture( "/packages/card-sensorGrid/sprites/" + doc.icon );

			
			var crateMaterial = new THREE.SpriteMaterial( { map: that.sprite, useScreenCoordinates: false, color: 0x00ff00 } );
			var sprite = new THREE.Sprite( crateMaterial );
			sprite.position.set( doc.x, doc.y, doc.z );
			sprite.scale.set( 50, 50, 1.0 ); // imageWidth, imageHeight
			that.scene.add( sprite );

			that.sceneSprites[doc._id] = sprite;

		}, changed: function(doc) {
			that.sceneSprites[doc._id].position.set(doc.x, doc.y, doc.z);
		}, removed: function(doc) {
			delete that.sceneSprites[doc._id];
		}
	})
};

Template.card_sensor3d.destroyed = function() {
	this.sensorObserver.stop();
	this.subscription.stop();
};