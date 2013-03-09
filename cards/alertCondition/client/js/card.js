(function() {
	Template.card_alertCondition.rendered = function() {
	
		// set the scene size
		var WIDTH = 400,
			HEIGHT = 300;

		// set some camera attributes
		var VIEW_ANGLE = 45,
			ASPECT = WIDTH / HEIGHT,
			NEAR = 0.1,
			FAR = 10000;

		// get the DOM element to attach to
		// - assume we've got jQuery to hand
		var $container = $('#container');

		// create a WebGL renderer, camera
		// and a scene
		renderer = new THREE.WebGLRenderer();
		var camera = new THREE.PerspectiveCamera(	VIEW_ANGLE,
										ASPECT,
										NEAR,
										FAR	);
		var scene = new THREE.Scene();

		// the camera starts at 0,0,0 so pull it back
		camera.position.z = 300;

		// start the renderer
		renderer.setSize(WIDTH, HEIGHT);

		// attach the render-supplied DOM element
		$container.append(renderer.domElement);

		// create the sphere's material
		var sphereMaterial = new THREE.MeshLambertMaterial(
		{
			color: 0xCC0000
		});

		// set up the sphere vars
		var radius = 50, segments = 16, rings = 16;

		// create a new mesh with sphere geometry -
		// we will cover the sphereMaterial next!
		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, rings),
			sphereMaterial);

		// add the sphere to the scene
		scene.add(sphere);

		// and the camera
		scene.add(camera);

		// create a point light
		var pointLight = new THREE.PointLight( 0xFFFFFF );

		// set its position
		pointLight.position.x = 10;
		pointLight.position.y = 50;
		pointLight.position.z = 130;

		// add to the scene
		scene.add(pointLight);

		// shim layer with setTimeout fallback
		window.requestAnimFrame = (function(){
			return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame	||
					function( callback ){
					window.setTimeout(callback, 1000 / 60);
					};
		})();


		// usage:
		// instead of setInterval(render, 16) ....

		(function animloop(){
			requestAnimFrame(animloop);
			renderer.render(scene, camera);
		})();
		// place the rAF *before* the render() to assure as close to
		// 60fps with the setTimeout fallback.

	};
}());
	