Template.card_flintlibrary.cardName = "Flint Library";

Template.comp_flintAssetBrowser.containers = function() {
	var sel = {
		folderPath: Session.get('comp.flintAssetBrowser.currentDirectory') || '/'
	};
	return Flint.collection('flintAssetContainers').find(sel);
};

Template.comp_flintAssetBrowser.folders = function() {
	var sel = {
		folderPath: Session.get('comp.flintAssetBrowser.currentDirectory') || '/'
	};
	return Flint.collection('flintAssetFolders').find(sel);
};

Template.card_flintlibrary.containerSelected = function() {
	return (!Session.equals('comp.flintAssetBrowser.selectedContainer', undefined));
};

Template.comp_flintAssetBrowser.assetClass = function() {
	if (Session.equals('comp.flintAssetBrowser.selectedContainer', this._id)) {
		return "selected-container";
	}
};

Template.comp_flintAssetBrowser.currentDirectory = function() {
	return Session.get('comp.flintAssetBrowser.currentDirectory');
};

Template.comp_flintAssetBrowser.notRoot = function() {
	return !Session.equals('comp.flintAssetBrowser.currentDirectory', '/');
};

Template.comp_flintAssetBrowser.created = function() {
	Session.set('comp.flintAssetBrowser.currentDirectory', "/"); // Root view
	Session.set('comp.flintAssetBrowser.selectedContainer', undefined);
	Meteor.subscribe("flint.assets.objects.all");
	Meteor.subscribe("flint.assets.containers.all");
	Meteor.subscribe("flint.assets.folders.all");
};

Template.comp_flintAssetBrowser.events({
	'click a.folder': function(e, t) {
		Flint.beep();
		Session.set('comp.flintAssetBrowser.selectedContainer', undefined);
		Session.set('comp.flintAssetBrowser.currentDirectory', this.fullPath);
	},
	'click a.container': function(e, t) {
		Flint.beep();
		Session.set('comp.flintAssetBrowser.selectedContainer', this._id);
	},
	'click a.cd-dot-dot': function(e, t) {
		Flint.beep();
		var parent = Flint.collection('flintAssetFolders').findOne({fullPath: Session.get('comp.flintAssetBrowser.currentDirectory')}) || {};
		Session.set('comp.flintAssetBrowser.currentDirectory', parent.folderPath || "/");
		Session.set('comp.flintAssetBrowser.selectedContainer', undefined);
	},
	'click button.add-folder': function(e, t) {
		var n = prompt("Name this folder:");
		if (n) {
			var parent = Flint.collection('flintAssets').findOne(Session.get('comp.flintAssetBrowser.currentDirectory')) || {fullPath: ''};
			var obj = {
				type: "folder",
				name: n,
				fullPath: parent.fullPath + '/' + n,
				basePath: parent.fullPath
			};
			if (!Session.equals('comp.flintAssetBrowser.currentDirectory', undefined)) {
				obj.parentObject = Session.get('comp.flintAssetBrowser.currentDirectory');
			}
			Flint.collection('flintAssets').insert(obj);
		}
	},
	'click button.add-container': function(e, t) {
		var n = prompt("Name this container:");
		if (n) {
			var parent = Flint.collection('flintAssets').findOne(Session.get('comp.flintAssetBrowser.currentDirectory')) || {fullPath: ''};
			var obj = {
				type: "asset",
				name: n,
				fullPath: parent.fullPath + '/' + n,
				basePath: parent.fullPath,
				objects: {}
			};
			if (!Session.equals('comp.flintAssetBrowser.currentDirectory', undefined)) {
				obj.parentObject = Session.get('comp.flintAssetBrowser.currentDirectory');
			}
			Flint.collection('flintAssets').insert(obj);
		}
	}
});

/// comp_flintContainerView
Template.comp_flintContainerView.created = function() {
	// Deps.autorun(function() {
	// 	Meteor.subscribe("flint.assets.simulators");
	// 	Meteor.subscribe('flint.assets.objects', Session.get('comp.flintAssetBrowser.selectedContainer'));
	// });
};

Template.comp_flintContainerView.asset = function() {
	var a = Flint.collection('flintAssets').findOne(Session.get('comp.flintAssetBrowser.selectedContainer'));
	if (a.defaultObject) {
		var f = Flint.FS.collection('flintAssets').findOne(a.defaultObject);
		if (f) {
			a.defaultUrl = f.url();
		}
	}
	return a;
};

Template.comp_flintContainerView.simulators = function() {
	var asset = Flint.collection('flintAssets').findOne(Session.get('comp.flintAssetBrowser.selectedContainer'));

	if (asset) {
		// The difference between all simulators and those already defined
		var objectSimulators = _.keys(asset.objects || {});
		var allSimulators = _.pluck(Flint.simulators.find().fetch(), "simulatorId");
		var diffSimulators = _.difference(allSimulators, objectSimulators);
		return Flint.simulators.find({ simulatorId: {$in: diffSimulators}});
	}
};

Template.comp_flintContainerView.events({
	'click .add-object': function(e, t) {
		var files = t.find('input[type=file]').files; // FileList object
		var uploadObject = function (err, fileObj) {
	        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	        var a = Flint.collection('flintAssets').findOne(Session.get('comp.flintAssetBrowser.selectedContainer'));
	        var newObjects = a.objects;
	        newObjects[t.find('select :selected').value] = fileObj._id;
	        Flint.collection('flintAssets').update(a._id, {$set: {objects: newObjects}});
	    };
	    for (var i = 0, ln = files.length; i < ln; i++) {
	    	Flint.FS.collection('flintAssets').insert(files[i], uploadObject);
	    }
	},
	'click .set-default': function(e, t) {
		var files = t.find('input[type=file]').files; // FileList object
		var uploadDefault = function (err, fileObj) {
	        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	        Flint.collection('flintAssets').update(Session.get('comp.flintAssetBrowser.selectedContainer'), {$set: {defaultObject: fileObj._id}});
	    };
		for (var i = 0, ln = files.length; i < ln; i++) {
			Flint.FS.collection('flintAssets').insert(files[i], uploadDefault);
		}
	},
	'click img': function(e, t) {
		$(e.target).toggleClass('enlarged');
	}
});

Template.comp_flintContainerView.objects = function() {
	var asset = Flint.collection('flintAssets').findOne(Session.get('comp.flintAssetBrowser.selectedContainer')),
	objectKeys = _.values(asset.objects),
	objects = [];
	simulatorMapping = _.invert(asset.objects);
	Flint.FS.collection('flintAssets').find({_id: {$in: objectKeys}}).forEach(function(file) {
		objects.push({url: file.url(), simulatorId: simulatorMapping[file._id]});
	});

	return objects;
};