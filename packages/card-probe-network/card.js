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
    ship.scale.x = 5;
    ship.scale.y = 5;
    ship.scale.z = 5;
    return ship;
}
Template.card_probeNetwork.created = function(){
    this.animating = true;
}
Template.card_probeNetwork.rendered = function(){
    THREE.ImageUtils.crossOrigin = "";
    var viewWidth = $('.probe_network').width(),
    viewHeight = $('.probe_network').height();
    var onRenderFcts = [];

    var mouseVector = new THREE.Vector3();
    var projector = new THREE.Projector();
    var wireframeColor = new THREE.Color('#ffffff');

    launchProbe = function(position){
        var probeGeo = new THREE.SphereGeometry( 0.5, 12, 12 );
        var material = new THREE.MeshBasicMaterial( { opacity: 0.8, transparent:true,  color: wireframeColor } );
        var probe = new THREE.Mesh(probeGeo, material);
        scene.add(probe);
        TweenLite.to(probe.position,2,{x:position.x,y:position.y,z:position.z,onComplete:function(){
            var probeGeo = new THREE.SphereGeometry( 15, 6, 6 );
            var material = new THREE.MeshBasicMaterial( { opacity: 0.1, wireframe: true, transparent:true,  color: wireframeColor } );
            var probe = new THREE.Mesh(probeGeo, material);
            scene.add(probe);
            probe.position.set(position.x,position.y,position.z);
        }});
    }

    $('.probe_network').on('mousemove', function () {
        e = event;
        mouseVector.x = 2 * (e.offsetX / viewWidth) - 1;
        mouseVector.y = 1 - 2 * (e.offsetY / viewHeight);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseVector.clone(), camera),
        intersects = raycaster.intersectObjects(scene.children);
        scene.children.forEach(function( cube ) {
            if (cube.material){
                cube.material.color.setRGB( 1, 1, 1 );
            }
        });
        for (var i = 0; i < intersects.length; i++) {
            var intersection = intersects[i],
            obj = intersection.object;
            obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
        }
    });
    $('.probe_network').on('click',function(){
        e = event;
        mouseVector.x = 2 * (e.offsetX / viewWidth) - 1;
        mouseVector.y = 1 - 2 * (e.offsetY / viewHeight);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseVector.clone(), camera),
        intersects = raycaster.intersectObjects(scene.children);
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.type == 'Mesh'){

                intersection = intersects[i];
                if (!intersection.object.probe && intersection.object.probeBox){
                    launchProbe(intersection.object.position);
                    intersection.object.probe = true;
                    return false;
                }
            }
        }
        
    })
    var camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.01, 1000)
    camera.position.z = 130;
    camera.position.y = 90;
    window.camera = camera;
    var scene = new THREE.Scene();
    window.scene = scene;

    scene.add(shipDiagram());

    var sensorRange = new THREE.SphereGeometry( 30, 12, 12 );
    var wireframe = new THREE.MeshBasicMaterial( { opacity: 0.2, transparent:true, wireframe: true, color: wireframeColor } );
    scene.add(new THREE.Mesh( sensorRange, wireframe ));

    var probeBoxGeo = new THREE.BoxGeometry(3,3,3);
    for (var i=1; i<=8; i++){
        var wireframe = new THREE.MeshBasicMaterial( { opacity: 0.0, transparent:true, wireframe: true, color: wireframeColor } );
        var probeBox = new THREE.Mesh(probeBoxGeo, wireframe);
        scene.add(probeBox);
        edges = new THREE.EdgesHelper( probeBox, 0xffffff );
        scene.add(edges);

        probeBox.position.z = Math.sin(Math.PI/4 * i) * 60;
        probeBox.position.x = Math.cos(Math.PI/4 * i) * 60;
        probeBox.probeBox = true;
    }
    for (var i=1; i<=4; i++){
        var wireframe = new THREE.MeshBasicMaterial( { opacity: 0.0, transparent:true, wireframe: true, color: wireframeColor } );
        var probeBox = new THREE.Mesh(probeBoxGeo, wireframe);
        scene.add(probeBox);
        edges = new THREE.EdgesHelper( probeBox, 0xffffff );
        scene.add(edges);

        probeBox.position.z = Math.sin(Math.PI/2 * i + Math.PI/4) * 60/2;
        probeBox.position.x = Math.cos(Math.PI/2 * i + Math.PI/4) * 60/2;
        probeBox.position.y = 45;
        probeBox.probeBox = true;


        var wireframe = new THREE.MeshBasicMaterial( { opacity: 0.0, transparent:true, wireframe: true, color: wireframeColor } );
        var probeBox = new THREE.Mesh(probeBoxGeo, wireframe);
        scene.add(probeBox);
        edges = new THREE.EdgesHelper( probeBox, 0xffffff );
        scene.add(edges);

        probeBox.position.z = Math.sin(Math.PI/2 * i + Math.PI/4) * 60/2;
        probeBox.position.x = Math.cos(Math.PI/2 * i + Math.PI/4) * 60/2;
        probeBox.position.y = -45;
        probeBox.probeBox = true;
    }
    var light = new THREE.AmbientLight(0xaaaaaa); // soft white light
    scene.add(light);

    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        clearColor: 0xff0000,
        clearAlpha: 1
    });
    renderer.setSize(viewWidth, viewHeight);
    this.find('.probe_network').appendChild(renderer.domElement);
    var canvasElement = this.find('.probe_network canvas');

    controls = new THREE.OrbitControls(camera);
    controls.noZoom = true;
    controls.noPan = true;
    window.controls = controls;
    onRenderFcts.push(function () {
        controls.update();
    });

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
}