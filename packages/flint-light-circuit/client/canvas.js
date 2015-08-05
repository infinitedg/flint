var Modules = Flint.collection('lightcircuit-modules');
var Links = Flint.collection('lightcircuit-links');
Template.canvas.created = function(){
	Tracker.autorun(function(){
		Meteor.subscribe('lightCircuit_modules');
		Meteor.subscribe('lightCircuit_links');
	});
	Session.set('moduleCanvasScale', 1);
};
Template.canvas.rendered = function(){
	// Keypress Listener for keyboard events;
	var listener;
	if (Keypress){
		listener = new Keypress.Listener();
		listener.simple_combo('meta backspace', function(){
			Modules.remove({_id:Session.get('selectedModule')});
		});
	}
};
Template.canvas.helpers({
	currentScale:function(){
		return Session.get('moduleCanvasScale');
	},
	drag:function(){
		return Session.get('dragCoords');
	},
	link:function(){
		return Links.find();
	},
	linkCoords:function(){
		var coords;
		var parent = Modules.findOne({_id:this.parent});
		var child = Modules.findOne({_id:this.child});
		if (parent && child){
			coords = {
				start:{
					x:parent.xPosition + 160,
					y:parent.yPosition + 16,
				},
				c1:{
					x:parent.xPosition + (child.xPosition - parent.xPosition) / 4 + 160,
					y:parent.yPosition + 16,
				},
				c2:{
					x:child.xPosition - (child.xPosition - parent.xPosition) / 4,
					y:child.yPosition + 16,
				},
				end:{
					x:child.xPosition,
					y:child.yPosition + 16,
				},
			};
			return coords;
		}
	},
	module:function(){
		return Modules.find();
	},
	moduleSelected:function(){
		if (this._id === Session.get('selectedModule')){
			return 'node_selected';
		}
	},
	nodePosition:function(){
		return this.xPosition + ',' + this.yPosition;
	},


});
Template.canvas.events({
	'mousedown .port':function(e){
		e.preventDefault();
		Session.set('dragging', {_id:this._id, type:e.target.classList[1]});
	},
	'mouseup .port':function(e){
		var parent;
		var parents;
		var child;
		if (Session.get('dragging')){
			if (this._id === Session.get('dragging')._id ||
				Session.get('dragging').type === e.target.classList[1]){
				return false;
			}
			if (Session.get('dragging').type === 'output'){
				parent = Session.get('dragging')._id;
				child = this._id;
			} else {
				parent = this._id;
				child = Session.get('dragging')._id;
			}
			// TODO: Check for circular chains by
			// checking if the current parents of an object
			parents = Modules.findOne({_id:child}).parents;
			if ($.inArray(parent, parents) === -1){
				// Make sure that the child can take more parents;

				parents.push(parent);
				if (Modules.findOne({_id:child}).inputs >= parents.length){
					Modules.update({_id:child}, {$set:{parents:parents}});
				}
			}
		}
	},
	'mouseup svg':function(){
		Session.set('dragging', null);
		Session.set('dragCoords', null);
	},
	'mousemove svg':function(e){
		var coords;
		if (Session.get('dragging')){
			if (!Session.get('dragCoords')){
				coords = {
					start:{
						x:e.pageX - 180,
						y:e.pageY,
					},
					c1:{
						x:e.pageX - 180,
						y:e.pageY,
					},
					c2:{
						x:e.pageX - 180,
						y:e.pageY,
					},
					end:{
						x:e.pageX - 180,
						y:e.pageY,
					},
				};
			} else {
				coords = Session.get('dragCoords');
			}
			coords.end = {
				x:e.pageX - 180,
				y:e.pageY,
			};
			coords.c1 = {
				x:(coords.start.x + (coords.end.x - coords.start.x) / 2),
				y:coords.start.y,
			};
			coords.c2 = {
				x:(coords.end.x - (coords.end.x - coords.start.x) / 2),
				y:coords.end.y,
			};
			Session.set('dragCoords', coords);
		}
	},
	'mousedown .ui-draggable':function(e){
		var self = this;
		if (e.target.classList[0] === 'port'){
			return false;
		}
		a = Draggable.create(e.currentTarget, {
			onDragEnd:function(){
				Modules.update({_id:self._id},
					{$set:{xPosition:this.endX, yPosition:this.endY}});
				Draggable.get(e.target).kill();
			},
		});
		e.target = e.currentTarget;
		a[0].startDrag(e);
	},
	'mouseup .node':function(e){
		Session.set('selectedModule', this._id);
		e.preventDefault();
	},
	'mousedown svg':function(){
		Session.set('selectedModule', null);
	},
	'keydown window':function(){

	},
});
