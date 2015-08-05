moduleTypes = [];
Meteor.publish('lightCircuit_categories', function(){
	this.added('lightcircuit-categories', 'input',
		{'name':'input', 'label':'Input'});
	this.added('lightcircuit-categories', 'function',
		{'name':'function', 'label':'Function'});
	this.added('lightcircuit-categories', 'output',
		{'name':'output', 'label':'Output'});
	this.added('lightcircuit-categories', 'other',
		{'name':'other', 'label':'Other'});
	this.ready();
});
Meteor.publish('lightCircuit_moduletypes', function(){
	var self = this;
	moduleTypes.forEach( function(e){
		self.added('lightcircuit-moduletypes', e.name, e);
	});
	self.ready();
});
Meteor.publish('lightCircuit_modules', function(){
	return Flint.collection('lightcircuit-modules').find();
});
Meteor.publish('lightCircuit_links', function(){
	var self = this;
	Flint.collection('lightcircuit-modules').find().observeChanges({
		added:function(id, doc){
			if (doc.parents.length > 0){
				doc.parents.forEach(function(e){
					var obj = {
						parent:e,
						child:id,
					};
					self.added('lightcircuit-links', Random.id(), obj);
				});
			}
		},
		changed:function(id, doc){
			if (doc.parents){
				if (doc.parents.length > 0){
					doc.parents.forEach(function(e){
						var obj = {
							parent:e,
							child:id,
						};
						self.added('lightcircuit-links', Random.id(), obj);
					});
				}
			}
		},
	});
	self.ready();
});
