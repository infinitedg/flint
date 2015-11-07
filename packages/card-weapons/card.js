Template.card_weapons.created = function(){
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('card-weapons-phasers', Flint.simulatorId());
	});
}
Template.card_weapons.helpers({
	phasers:function(){
		return Flint.collection('phasers').find();
	},
	charge:function(){
		return Math.round(this.charge);
	}
})

Template.targetingGrid.events({
	//Mouse over to target a contact
	'.targeting_box mousemove' : function (e) {
		debugger;
		
	}
})

Template.targetingGrid.created = function(){
	this.subscription = Tracker.autorun(function () {
		Meteor.subscribe('cards.core-targetingGrid.targets', Flint.simulatorId());
	});
}
Template.targetingGrid.destroyed = function(){
	this.armyObserver.stop();
	this.subscription.stop();
}
Template.targetingGrid.rendered = function(){
	THREE.ImageUtils.crossOrigin = "";

	var onRenderFcts = [];
	var mouseVector = new THREE.Vector3();
	var projector = new THREE.Raycaster();
	var viewRadius = 1
	var sceneSprites = {};
	var renderer	= new THREE.WebGLRenderer({
		alpha: true,
		clearColor: 0xff0000,
		clearAlpha: 1
	});
	var domElement = this.find('.targeting_box')
	renderer.setSize( domElement.clientWidth, domElement.clientWidth*(2/3) ); //Purposely make it square.
	domElement.appendChild(renderer.domElement);
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(30, domElement.clientWidth / domElement.clientHeight, 0.01, 1000);
	camera.position.z = 3;

	//////////////////////////////////////////////////////////////////////////////////
	//		default 3 points lightning					//
	//////////////////////////////////////////////////////////////////////////////////
	
	var ambientLight= new THREE.AmbientLight( 0x020202 )
	scene.add( ambientLight)
	var light = new THREE.AmbientLight(0xaaaaaa); // soft white light
	scene.add(light);
	var frontLight	= new THREE.DirectionalLight('white', 1)
	frontLight.position.set(1.5, 1.5, 2)
	scene.add( frontLight )
	var backLight	= new THREE.DirectionalLight('white', 0.75)
	backLight.position.set(-1.5, -1.5, -2)
	scene.add( backLight )

	var material = new THREE.LineBasicMaterial({
		color: 0x00ff00
	});
    //
    //Make a Box
    //
    for(var i = -1; i <= 1; i += 0.5){
    	var geometry = new THREE.Geometry();
    	geometry.vertices.push(new THREE.Vector3(-1, 1, i));
    	geometry.vertices.push(new THREE.Vector3(1, 1, i));
    	geometry.vertices.push(new THREE.Vector3(1, -1, i));
    	geometry.vertices.push(new THREE.Vector3(-1, -1, i));
    	geometry.vertices.push(new THREE.Vector3(-1, 1, i));
    	scene.add(new THREE.Line(geometry, material));
    }
    var contactTarget;
	//Make a Target
	//coordinates: {x: y: z: }
	var createTarget = function(coordinates){
		var spriteColor;
		var sprite;
		spriteColor = "#ff0000";
		spriteColor = new THREE.Color(spriteColor);
		sprite = THREE.ImageUtils.loadTexture('/packages/card-weapons/crosshair.png');
		var material = new THREE.SpriteMaterial({
			map: sprite,
			useScreenCoordinates: false,
			color: spriteColor,
			rotation: Math.PI/2

		});
		spriteUL = new THREE.Sprite(material);
		spriteUL.scale.set(0.1,0.1,1);

		var material = new THREE.SpriteMaterial({
			map: sprite,
			useScreenCoordinates: false,
			color: spriteColor,
			rotation: 0

		});
		spriteBL = new THREE.Sprite(material);
		spriteBL.scale.set(0.1,0.1,1);

		var material = new THREE.SpriteMaterial({
			map: sprite,
			useScreenCoordinates: false,
			color: spriteColor,
			rotation: Math.PI
		});
		spriteUR = new THREE.Sprite(material);
		spriteUR.scale.set(0.1,0.1,1);

		var material = new THREE.SpriteMaterial({
			map: sprite,
			useScreenCoordinates: false,
			color: spriteColor,
			rotation: 3*Math.PI/2
		});
		spriteBR = new THREE.Sprite(material);
		spriteBR.scale.set(0.1,0.1,1);

		var c = coordinates;
		contactTarget = new THREE.Object3D();
		spriteUL.position.set(c.x-0.08, c.y-0.08, c.z);
		spriteBL.position.set(c.x-0.08, c.y+0.08, c.z);
		spriteUR.position.set(c.x+0.08, c.y-0.08, c.z);
		spriteBR.position.set(c.x+0.08, c.y+0.08, c.z);

		contactTarget.add(spriteUL);
		contactTarget.add(spriteBL);
		contactTarget.add(spriteUR);
		contactTarget.add(spriteBR);

		scene.add(contactTarget);
	}

	createTarget({x:0,y:0,z:0});

	//Now to add the actual contact and move it around.
	var addContact = function(doc){
		var spriteColor;
		var sprite;
		spriteColor = doc.color || '#fff';
		spriteColor = new THREE.Color(spriteColor);
		sprite = THREE.ImageUtils.loadTexture(Flint.a('/Sensor Icons/' + doc.icon));
		var material = new THREE.SpriteMaterial({
			map: sprite,
			useScreenCoordinates: false,
			color: spriteColor
		});
		sprite = new THREE.Sprite(material);

		sprite.position.set(doc.x * viewRadius / 2, doc.y * viewRadius / 2, doc.z * viewRadius / 2);
		sprite.scale.set(0.08 * viewRadius, 0.08 * viewRadius, 1.0);
		sprite.targeted = doc.targeted || false;
		sprite.picture = doc.picture;
		sprite.label = doc.label;
		sprite.targetCount = 0;
		sprite._id = doc._id;
		scene.add(sprite);

		sceneSprites[doc._id] = sprite;
	}	

	//Let the contact wander around
	onRenderFcts.push(function(delta, now){
		var speedLimit = 10,
		speedConstant1 = 2.5,
		speedConstant2 = 1.5;
		contactTarget.visible = false;
		for (var spriteId in sceneSprites){
			sprite = sceneSprites[spriteId];
			sprite.targetCount -= 0.05;
			if (sprite.targetCount <= 0)
				sprite.targetCount = 0;
			if (sprite.targetCount < 10){
				Flint.collection('targetContacts').update({_id:spriteId},{$set:{targeted:"false"}});
			}
			if (!sprite.speed)
				sprite.speed = {x:-5,y:-5,z:-5};
			for (var key in sprite.speed){
				if (sprite.speed[key] / speedLimit > 0.99*2)
					sprite.speed[key] = speedLimit - 1;
				if (sprite.speed[key] / speedLimit < -0.99*2)
					sprite.speed[key] = -1 * (speedLimit - 1);

				if (sprite.position[key] >= 1*2){
					sprite.position[key] = 0.99*2;
					if (sprite.speed[key] > 0)
						sprite.speed[key] = 0;
				}
				if (sprite.position[key] <= -1*2){
					sprite.position[key] = -0.99*2;
					if (sprite.speed[key] < 0)
						sprite.speed[key] = 0;
				}

				var randomNum = 1-(Math.random()*2);
				if (randomNum < sprite.position[key] ){
					sprite.speed[key] += (((speedLimit - Math.abs(sprite.speed[key])) / speedLimit) * -1 * speedConstant1);
					sprite.speed[key] += ((1 - Math.abs(sprite.position[key]) * -1 * speedConstant2))/500;
					sprite.speed[key] += 1-(Math.random()*2);
				} else {
					sprite.speed[key] += (((speedLimit - Math.abs(sprite.speed[key])) / speedLimit) * speedConstant1);
					sprite.speed[key] += ((1 - Math.abs(sprite.position[key]) * speedConstant2))/500;
				}
				sprite.position[key] += (sprite.speed[key]*delta/100);

			}
			if (sprite.targeted === true){
				contactTarget.position.set(sprite.position.x,sprite.position.y,sprite.position.z);
				contactTarget.visible = true;
			}
			
		};
	})
	//////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	domElement.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / event.target.clientWidth ) - 0.5
		mouse.y	= (event.clientY / event.target.clientHeight) - 0.5
		var e = event;
		mouseVector.x = 2 * (e.offsetX / e.target.clientWidth) - 1;
		mouseVector.y = 1 - 2 * (e.offsetY / e.target.clientHeight);

		var raycaster = projector.setFromCamera(mouseVector.clone(), camera),
		intersects = projector.intersectObjects(scene.children);

		scene.children.forEach(function( obj ) {
			if (obj.material){
				obj.material.opacity = 1
				if (obj.targetCount > 10){
					obj.targetCount = 40;
					Flint.collection('targetContacts').update({_id:obj._id},{$set:{targeted:true}});
				} else {
					Flint.collection('targetContacts').update({_id:obj._id},{$set:{targeted:"false"}});
				}
			}
		});
		for (var i = 0; i < intersects.length; i++) {
			var intersection = intersects[i]
			intersection.object.material.opacity = 0.75;
			intersection.object.targetCount += 0.1;
			if (!isNaN(intersection.object.targetCount)){
				//console.log(intersection.object.targetCount);
			}
		}
	}, false)
onRenderFcts.push(function(delta, now){
	camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
	camera.position.y += (mouse.y*-1 - camera.position.y) * (delta*3)
	camera.lookAt( scene.position )
})

	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Rendering Loop runner						//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})

	this.armyObserver = Flint.collection('targetContacts').find().observeChanges({
		added: function(id, doc){
			addContact({
				color: doc.color || "#00ff00",
				armyId: doc.armyId,
				icon: doc.icon,
				label: doc.label,
				x:1-(Math.random()*2),
				y:1-(Math.random()*2),
				z:1-(Math.random()*2),
				targeted: doc.targeted,
				_id: id
			});
		},
		changed: function(id, fields){
			if (fields.color){
				spriteColor = new THREE.Color(fields.color);
				sceneSprites[id].material.color = spriteColor;
			}
			if (fields.icon){
				sprite = THREE.ImageUtils.loadTexture(Flint.a('/Sensor Icons/' + fields.icon));
				sceneSprites[id].material.map = sprite;
			}
			if (fields.label){
				sceneSprites[id].label = fields.label;
			}
			if (fields.targeted){
				sceneSprites[id].targeted = fields.targeted;
			}
		},
		removed: function(id){
			scene.remove( sceneSprites[id] );
			delete sceneSprites[id];
		}
	})

}