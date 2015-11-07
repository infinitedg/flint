var viewRadius = 100,
viewWidth = 580,
viewHeight = 580;


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
Template.probeTab_sensors.created = function () {
	this.animating = true;
	this.subscription = Tracker.autorun(function () {
		Meteor.subscribe('cards.card-sensor3d.contacts', Flint.simulatorId());
	});
};


Template.probeTab_sensors.rendered = function () {
	THREE.ImageUtils.crossOrigin = "";

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

    controls = new THREE.OrbitControls(camera, $('.sensor_box')[0]);
    controls.noZoom = true;
    controls.noPan = true;

    onRenderFcts.push(function () {
    	controls.update();
    });

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
};