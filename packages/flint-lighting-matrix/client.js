Template.card_lightingCircuit.helpers({
	templateName: function() {
		console.log(this, 'lightingmodule_' + this.name);
		return 'lightingmodule_' + this.name;
	},
	moduleTypes: function() {
		return Flint.collection('flintLightingModuleTypes').find();
	},
	module: function() {
		return Flint.collection('flintLightingModules').find();
	}
})

var shrinker = document.getElementById("shrinker");

Template.card_lightingCircuit.events({
	'click #addChannel': function(e, t) {
		var obj = {
			name: 'channel',
			leftPosition: 150,
			topPosition: 150,
			data: {
				number: null,
				label: null
			}
		}
		Flint.collection('flintLightingModules').insert(obj);
	},
	'mousedown .module': function(event, t) {
		console.log('hi there!');
		var dragObj = new Object();
		dragObj.zIndex = 0;
		var el;
		var x, y;

		if (event.target.tagName == "SELECT")
			return;
		el = event.target;

		if (el.nodeType == 3) // if it's a text node
			el = el.parentNode;
		if (el.classList.contains("module-title"))
			el = el.parentNode;
		if (el.classList.contains("content"))
			el = el.parentNode;
		if (!el.classList.contains("module"))
			return;

		//dragObj.elNode = el;
		/*
		    // If this is a text node, use its parent element.
		    if ((dragObj.elNode.nodeType == 3)||(dragObj.elNode.className == "analyserCanvas"))
		    	dragObj.elNode = dragObj.elNode.parentNode;
		    */
		    var shrinker = document.getElementById("shrinker");
		// Get cursor position with respect to the page.
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;

		x = x / parseFloat(shrinker.style.zoom);
		y = y / parseFloat(shrinker.style.zoom);

		// Save starting positions of cursor and element.
		dragObj.cursorStartX = x;
		dragObj.cursorStartY = y;
		dragObj.elStartLeft = parseInt(this.leftPosition, 10);
		dragObj.elStartTop = parseInt(this.topPosition, 10);
		dragObj._id = this._id;
		if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
		if (isNaN(dragObj.elStartTop)) dragObj.elStartTop = 0;

		// Update element's z-index.
		el.style.zIndex = ++dragObj.zIndex;

		// Capture mousemove and mouseup events on the page.
		Session.set('draggingObject', dragObj);
		event.preventDefault();
	},
	'mousemove .module': function(event, t) {
		console.log('hi there!');
		if (Session.get('draggingObject')) {
			//if (this._id == Session.get('draggingObject')._id) {
				console.log('were in')
				var x, y;
				var dragObj = Session.get('draggingObject');
					//var e = dragObj.elNode;
					var shrinker = t.find('#shrinker');
					// Get cursor position with respect to the page.
					x = event.clientX + window.scrollX;
					y = event.clientY + window.scrollY;
					x = x / parseFloat(shrinker.style.zoom);
					y = y / parseFloat(shrinker.style.zoom);
					// Move drag element by the same amount the cursor has moved.
					var obj = {
						leftPosition: (dragObj.elStartLeft + x - dragObj.cursorStartX),
						topPosition: (dragObj.elStartTop + y - dragObj.cursorStartY)
					}
					Flint.collection('flintLightingModules').update({
						_id: Session.get('draggingObject')._id
					}, {
						$set: obj
					});

					if (e.inputConnections) { // update any lines that point in here.
						var c;

						var off = e.inputs;
						x = window.scrollX + 12;
						y = window.scrollY + 12;

						while (off) {
							x += off.offsetLeft;
							y += off.offsetTop;
							off = off.offsetParent;
						}

						for (c = 0; c < e.inputConnections.length; c++) {
							e.inputConnections[c].line.setAttributeNS(null, "x1", x);
							e.inputConnections[c].line.setAttributeNS(null, "y1", y);
						}
					}

					if (e.outputConnections) { // update any lines that point out of here.
						var c;

						var off = e.outputs;
						x = window.scrollX + 12;
						y = window.scrollY + 12;

						while (off) {
							x += off.offsetLeft;
							y += off.offsetTop;
							off = off.offsetParent;
						}

						for (c = 0; c < e.outputConnections.length; c++) {
							e.outputConnections[c].line.setAttributeNS(null, "x2", x);
							e.outputConnections[c].line.setAttributeNS(null, "y2", y);
						}
					}

					event.preventDefault();
				//}
			}
		},
		'mouseup .module': function(event, t) {
			Session.set('draggingObject', false);
		}
	})

Template.card_lightingCircuit.created = function() {
	Meteor.subscribe("lightingModules");
	Meteor.subscribe('lightingModuleTypes');
}