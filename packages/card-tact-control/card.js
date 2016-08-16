Template.card_tacControl.created = function(){
	Meteor.subscribe('card.viewscreen.tacticalscreens');
  Meteor.subscribe('card.viewscreen.tacticaltemplatecontacts');
  Meteor.subscribe('card.viewscreen.inputs',Flint.simulatorId());
};

Template.card_tacControl.helpers({
	tacticalScreens: function(){
		return Flint.collection('tacticalscreens').find();
	},
	currentTactical: function(){
		return Session.get('card_tactical-tactical');
	},
  contacts: function(){
    return Flint.collection('tacticalTemplateContacts').find();
  },
  contactIcon:function(){
    var self = this;
    Meteor.setTimeout(function(){
      Draggable.create($("#icon-" + self._id), {
        edgeResistance: 0.5,
        onDragEnd: function (e) {
          var obj = {
            name: self.name,
            icon: self.asset,
            label: self.name,
            maxSpeed: 10,
            cloakable: true,
            cloaked: false,
            x: (this.pointerX - 230) * 2,
            y:(this.pointerY - 230) * 2,
            destx: (this.pointerX - 230) * 2,
            desty: (this.pointerY - 230) * 2,
            speed: 1,
            isMoving: true,
            filter: {
              red: 50,
              blue: 50,
              green: 255
            },
            tacticalScreen: Session.get('card_tactical-tactical')
          };
          TweenLite.to(e.target, 0.25, {
            transform: 'translate3d(0px,0px,0px)'
          });
          Flint.collection('tacticalContacts').insert(obj);
        }
      });
    },500);
    return Flint.a(this.asset);
  }

});

Template.card_tacControl.events({
	'click .createTactical':function(){
		var name = prompt("What is the name of the tactical screen?");
		if (name){
			Session.set('card_tactical-tactical',Flint.collection('tacticalscreens').insert({name:name}));
		}
	},
	'click .duplicateTactical':function(){
		var currentTactical = Flint.collection('tacticalscreens').findOne({_id:Session.get('card_tactical-tactical')});
		if (currentTactical){
			delete currentTactical._id;
			currentTactical.name = currentTactical.name + " Copy";
			Session.set('card_tactical-tactical',Flint.collection('tacticalscreens').insert(currentTactical));
		}
	},
	'change .template-tactical':function(e){
		Session.set('card_tactical-tactical',e.target.value);
	},
  'click .add-contact':function(){
    var selectedContainer = Flint.collection('flintassetcontainers').findOne({_id:Session.get('comp.flintAssetBrowser.selectedContainer')});
    console.log('ICON', selectedContainer);
    if (selectedContainer){
      var name = prompt("What is the name of this icon?");
      if (name){
        var obj = {
          asset: selectedContainer.fullPath,
          name: name,
        };
        if (Flint.collection('tacticalTemplateContacts').find({name:name, asset: selectedContainer.fullPath}).count() === 0){
          Flint.collection('tacticalTemplateContacts').insert(obj);
        }
      }
    }
  },
});


var contactsLayer = new Kinetic.Layer();

var k = {
	width: 1920,
	height: 1080,
	scale: 4,
  	// Used to determine the sizing of contacts
  	strokeWidth: 2,
  	color: "ff0000",
  	filter: {
  		red: 255,
  		green: 0,
  		blue: 0
  	},
  },
  contactsArray = {};
  groupArray = {};
  labelArray = {};

  Template.viewscreen_tactical.created = function(){
    Meteor.subscribe('card.viewscreen.tacticalcontacts', this.tactical);
    this.tacticalObserver = Flint.collection('tacticalContacts').find({tacticalScreen:this.tactical}).observeChanges({
      added: function(id, doc) {
       if (!contactsArray[id]) {
        var imageObj = new Image();
        imageObj.onload = function() {
          Meteor.setTimeout(function(){
           var contact = new Kinetic.Group({
            x: (doc.x),
            y: (doc.y),
            visible: !doc.cloaked,
            draggable: true
          });
           var ghostContact = new Kinetic.Group({
            x: (doc.x),
            y: (doc.y),
            visible: !doc.cloaked,
            draggable: false,
            opacity: 0.75
          });
           var icon = new Kinetic.Image({
            image: imageObj,
            width: 60,
            height: 60,
          });
           var label = new Kinetic.Text({
            x: 0,
            y: 60,
            text: doc.label,
            fontSize: 24,
            fontFamily: 'Gill Sans',
            fill: '#fff',
            align: 'center'
          });
           icon.filters([Kinetic.Filters.RGB, Kinetic.Filters.HSL]);
           icon.red(doc.filter.red);
           icon.blue(doc.filter.blue);
           icon.green(doc.filter.green);
           // add the shape to the layer
           contact.add(icon);
           contact.add(label);
           ghost = icon.clone();
           ghostLabel = label.clone();
           ghostContact.add(ghost);
           ghostContact.add(ghostLabel);
           contactsLayer.add(ghostContact);
           contactsLayer.add(contact);

           icon.cache();
           ghost.cache();
           label.draw();
           icon.draw();
           icon.visible(doc.isVisible);
           contactsArray[id] = icon;
           labelArray[id] = label;
           groupArray[id] = contact;
           contactsArray[id + "-ghost"] = ghost;
           labelArray[id + "-ghost"] = ghostLabel;
           groupArray[id + "-ghost"] = ghostContact;

           contact.on('dragend', function (evt) {
            var x = this.getX(),
            y = this.getY(),
            width =  this.children[0].attrs.image.width,
            height =  this.children[0].attrs.image.height,
            d = true;
            if (d) {
              var updateObj = {
                isMoving: true,
                dstX: x,
                dstY: y
              };
              Flint.collection('tacticalContacts').update({_id:id},{$set:updateObj});

              Session.set('mouseCoords',{x:evt.evt.clientX,y:evt.evt.clientY})
            }
            contactsLayer.draw();
          });
         },500);
        };
        imageObj.src =  (Flint.a(doc.icon));
      }
    },
    changed: function(id, fields) {
      var icon = contactsArray[id + "-ghost"];
      var label = labelArray[id + "-ghost"];
      var group = groupArray[id + "-ghost"];
      if (icon) {
        if (fields.x !== undefined) {
         group.setX((fields.x));
       }
       if (fields.y !== undefined) {
         group.setY((fields.y));
       }

       if (fields.cloaked !== undefined) {
         group.visible(!fields.cloaked);
       }
       if (fields.label !== undefined){
         label.text = fields.label;
       }

       contactsLayer.draw();
     }
   },
   removed: function(id) {
     labelArray[id].remove();
     groupArray[id].remove();
     contactsArray[id].remove();
     labelArray[id + "-ghost"].remove();
     groupArray[id + "-ghost"].remove();
     contactsArray[id + "-ghost"].remove();
     contactsLayer.draw();
   }
 });
  };

  Template.viewscreen_tactical.rendered = function(){
   k.container = this.find('.tactical-container');

   var stage = new Kinetic.Stage({
    container: k.container,
    width: k.width,
    height: k.height
  });

   var circlePrototype = {
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: k.radius,
    stroke: k.color,
    strokeWidth: k.strokeWidth
  };

  var blackBack = new Kinetic.Rect({x:0, y:0, width: stage.getWidth(), height: stage.getHeight(), stroke: '#333', strokeWidth: 2});

  	// Draw lines
  	var linepoints = function(number, h) {
    	// angle in degrees converted to radians
    	if (h){
    		var y1 = number;
    		var y2 = number;
    		var x1 = 0;
    		var x2 = stage.getWidth();
    	} else {
    		var x1 = number;
    		var x2 = number;
    		var y1 = 0;
    		var y2 = stage.getHeight();
    	}

    	return [x1, y1, x2, y2];
    };

    var linePrototype = {
    	stroke: '#333',
    	strokeWidth: 1,
    	lineCap: 'round',
    	lineJoin: 'round',
    };
    var backdrop = new Kinetic.Layer();
    backdrop.add(blackBack);
    var line;
    for (var i = 1; i< 16; i++){
    	line = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(i*120)}));
    	backdrop.add(line);
    }
    for (i = 1; i< 9; i++){
    	line = new Kinetic.Line(_.extend(linePrototype, { points: linepoints(i*120, true) }));
    	backdrop.add(line);
    }
    var letters = ['A','B','C','D','E','F','G','H','I','J','K'];
    for (var i = 0; i<16; i++){
      for (var j=0; j<9; j++){
        var text = new Kinetic.Text({
          x: i*120 + 22,
          y: j*120 + 93,
          text: letters[j]+(i+1),
          fontSize: 24,
          fontFamily: 'Helvetica',
          fill: '#333'
        });
        backdrop.add(text);
      }
    }


  	// add the layer to the stage
  	stage.add(backdrop);

  	stage.add(contactsLayer);
  };

  Template.viewscreen_tactical.destroyed = function() {
  	this.tacticalObserver.stop();
  };

  Template.viewscreen_tactical.events({

  });
