/**
flintAssets collection object schema

{
	_id: generated
	type: folder|asset
	name: String
	fullPath: The full path to this object, including its name. /asset or /decks/floors/1
	basePath: Like fullPath without the name. / or /decks/floors/ - always ends in a slash
	parentObject: _id of enclosing object
		If this doesn't exist, then it's at the root
	
	// The following applies only to assets
	defaultObject: Absolute URL to the asset in question
	objects: {
		simulatorId: {
			url: The URL in question
		}
	}
}
*/
Template.card_flintlibrary.cardName = "Flint Library";

Template.comp_flintassetbrowser.assets = function() {
	var sel = {};
	if (!Session.equals('comp.flintassetbrowser.currentDirectory', undefined)) {
		sel.parentObject = Session.get('comp.flintassetbrowser.currentDirectory');
	}
	return Flint.collection('flintAssets').find(sel);
};

Template.card_flintlibrary.assetSelected = function() {
	return (!Session.equals('comp.flintassetbrowser.selectedAsset', undefined));
};

Template.comp_flintassetbrowser.assetType = function(comp) {
	return (comp === this.type);
};

Template.comp_flintassetbrowser.assetClass = function() {
	if (Session.equals('comp.flintassetbrowser.selectedAsset', this._id)) {
		return "selected-asset";
	}
};

Template.comp_flintassetbrowser.currentDirectory = function() {
	var d = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.currentDirectory'));
	if (!d) {
		return {basePath: "/", name: "root", fullPath: "/"}
	} else {
		return d;
	}
};

Template.comp_flintassetbrowser.notRoot = function() {
	return (!Session.equals('comp.flintassetbrowser.currentDirectory', undefined));
};

Template.comp_flintassetbrowser.created = function() {
	Session.set('comp.flintassetbrowser.currentDirectory', undefined); // Root view
	Session.set('comp.flintassetbrowser.selectedAsset', undefined);
	Deps.autorun(function(){
		Meteor.subscribe("flint.assets", Session.get('comp.flintassetbrowser.currentDirectory'));
	});
};

Template.comp_flintassetbrowser.events({
	'click a.asset': function(e, t) {
		Flint.beep();
		if (this.type === "folder") {
			Session.set('comp.flintassetbrowser.selectedAsset', undefined);
			Session.set('comp.flintassetbrowser.currentDirectory', this._id);
		} else {
			Session.set('comp.flintassetbrowser.selectedAsset', this._id);
		}
	},
	'click a.cd-dot-dot': function(e, t) {
		Flint.beep();
		var parent = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.currentDirectory')) || {};
		Session.set('comp.flintassetbrowser.currentDirectory', parent.parentObject || undefined);
		Session.set('comp.flintassetbrowser.selectedAsset', undefined);
	},
	'click button.add-folder': function(e, t) {
		var n = prompt("Name this folder:");
		if (n) {
			var parent = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.currentDirectory')) || {fullPath: ''};
			var obj = {
				type: "folder",
				name: n,
				fullPath: parent.fullPath + '/' + n,
				basePath: parent.fullPath
			};
			if (!Session.equals('comp.flintassetbrowser.currentDirectory', undefined)) {
				obj.parentObject = Session.get('comp.flintassetbrowser.currentDirectory');
			}
			Flint.collection('flintAssets').insert(obj);
		}
	},
	'click button.add-asset': function(e, t) {
		var n = prompt("Name this asset:");
		if (n) {
			var parent = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.currentDirectory')) || {fullPath: ''};
			var obj = {
				type: "asset",
				name: n,
				fullPath: parent.fullPath + '/' + n,
				basePath: parent.fullPath,
				objects: {}
			};
			if (!Session.equals('comp.flintassetbrowser.currentDirectory', undefined)) {
				obj.parentObject = Session.get('comp.flintassetbrowser.currentDirectory');
			}
			Flint.collection('flintAssets').insert(obj);
		}
	}
});

/// comp_flintassetview
Template.comp_flintassetview.created = function() {
	Deps.autorun(function() {
		Meteor.subscribe("flint.assets.simulators");
		Meteor.subscribe('flint.assets.objects', Session.get('comp.flintassetbrowser.selectedAsset'));
	});
};

Template.comp_flintassetview.asset = function() {
	var a = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.selectedAsset'));
	if (a.defaultObject) {
		var f = Flint.FS.collection('flintAssets').findOne(a.defaultObject);
		if (f) {
			a.defaultUrl = f.url();
		}
	}
	return a;
};

Template.comp_flintassetview.simulators = function() {
	var asset = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.selectedAsset'));

	if (asset) {
		// The difference between all simulators and those already defined
		var objectSimulators = _.keys(asset.objects || {});
		var allSimulators = _.pluck(Flint.simulators.find().fetch(), "simulatorId");
		var diffSimulators = _.difference(allSimulators, objectSimulators);
		return Flint.simulators.find({ simulatorId: {$in: diffSimulators}});
	}
};

Template.comp_flintassetview.events({
	'click .add-object': function(e, t) {
		var files = t.find('input[type=file]').files; // FileList object
        
        for (var i = 0, ln = files.length; i < ln; i++) {
	      Flint.FS.collection('flintAssets').insert(files[i], function (err, fileObj) {
	        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	        var a = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.selectedAsset'));
			var newObjects = a.objects;
			newObjects[t.find('select :selected').value] = fileObj._id;
			Flint.collection('flintAssets').update(a._id, {$set: {objects: newObjects}});
	      });
	    }
	},
	'click .set-default': function(e, t) {
		var files = t.find('input[type=file]').files; // FileList object
        
        for (var i = 0, ln = files.length; i < ln; i++) {
	      Flint.FS.collection('flintAssets').insert(files[i], function (err, fileObj) {
	        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	       Flint.collection('flintAssets').update(Session.get('comp.flintassetbrowser.selectedAsset'), {$set: {defaultObject: fileObj._id}});
	      });
	    }
	},
	'click img': function(e, t) {
		$(e.target).toggleClass('enlarged');
	}
});

Template.comp_flintassetview.objects = function() {
	var asset = Flint.collection('flintAssets').findOne(Session.get('comp.flintassetbrowser.selectedAsset')),
	objectKeys = _.values(asset.objects),
	objects = [];
	simulatorMapping = _.invert(asset.objects);
	Flint.FS.collection('flintAssets').find({_id: {$in: objectKeys}}).forEach(function(file) {
		objects.push({url: file.url(), simulatorId: simulatorMapping[file._id]});
	});

	return objects;
};