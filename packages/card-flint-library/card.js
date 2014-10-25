Template.card_flintlibrary.helpers({
	cardName: "Flint Library",
	containerSelected: function() {
		return (!Session.equals('comp.flintAssetBrowser.selectedContainer', undefined));
	}
});
Template.comp_flintAssetBrowser.helpers({
	notRoot: function() {
		return !Session.equals('comp.flintAssetBrowser.currentDirectory', '/');
	},
	containers: function() {
		var sel = {
			folderPath: Session.get('comp.flintAssetBrowser.currentDirectory') || '/'
		};
		return Flint.collection('flintAssetContainers').find(sel);
	},
	folders: function() {
		var sel = {
			folderPath: Session.get('comp.flintAssetBrowser.currentDirectory') || '/'
		};
		return Flint.collection('flintAssetFolders').find(sel);
	},
	assetClass: function() {
		if (Session.equals('comp.flintAssetBrowser.selectedContainer', this._id)) {
			return "selected-container";
		}
	},
	currentDirectory: function() {
		return Session.get('comp.flintAssetBrowser.currentDirectory');
	}
});
Template.comp_flintContainerView.helpers({
	container: function() {
		return Flint.collection('flintAssetContainers').findOne(Session.get('comp.flintAssetBrowser.selectedContainer'));
	},
	objects: function() {
		return Flint.collection('flintAssetObjects').find({containerId: Session.get('comp.flintAssetBrowser.selectedContainer')});
		return objects;
	},
	simulators: function() {
		var objects = Flint.collection('flintAssetObjects').find({containerId: Session.get('comp.flintAssetBrowser.selectedContainer')}).fetch();

		// The difference between all simulators and those already defined
		var objectSimulators = _.pluck(objects, "simulatorId");
		var allSimulators = _.pluck(_.union(Flint.simulators.find().fetch()), "simulatorId");
		var diffSimulators = _.difference(allSimulators, objectSimulators);
		return Flint.simulators.find({ simulatorId: {$in: allSimulators}});
	}
});

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
	'click a.containerLink': function(e, t) {
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
			var parentFolder = Flint.collection('flintAssetFolders').findOne({fullPath: Session.get('comp.flintAssetBrowser.currentDirectory')});
			var obj = {
				name: n
			};
			if (parentFolder) {
				obj.parentFolderId = parentFolder._id;
			}
			Flint.collection('flintAssetFolders').insert(obj);
		}
	},
	'click button.add-container': function(e, t) {
		var n = prompt("Name this container:");
		if (n) {
			var parentFolder = Flint.collection('flintAssetFolders').findOne({fullPath: Session.get('comp.flintAssetBrowser.currentDirectory')});
			var obj = {
				name: n
			};
			if (parentFolder) {
				obj.folderId = parentFolder._id;
			}
			Flint.collection('flintAssetContainers').insert(obj);
		}
	}
});

/// comp_flintContainerView
Template.comp_flintContainerView.created = function() {
	Meteor.subscribe("flint.assets.simulators");
};

Template.comp_flintContainerView.events({
	'click .add-object': function(e, t) {
		var files = t.find('input[type=file]').files; // FileList object
		var uploadObject = function (err, fileObj) {
			if (!err) {
		        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
		        var simulatorId = t.find('select :selected').value;
		        var object = Flint.collection('flintAssetObjects').findOne({
		        	containerId: Session.get('comp.flintAssetBrowser.selectedContainer'),
		        	simulatorId: simulatorId
		        });

		        // We have to do the following rigamarole since upserts are frowned upon
		        // on the client
		        if (object) {
		        	Flint.collection('flintAssetObjects').update(object._id, {$set : {objectId: fileObj._id}} );
		        } else {
		        	Flint.collection('flintAssetObjects').insert({
		        		simulatorId: simulatorId,
		        		containerId: Session.get('comp.flintAssetBrowser.selectedContainer'),
		        		objectId: fileObj._id
		        	});
		        }
		    } else {
		    	Flint.Log.error(err);
		    }
		};
		for (var i = 0, ln = files.length; i < ln; i++) {
			Flint.FS.collection('flintAssets').insert(files[i], uploadObject);
		}
	},
	'click .set-default': function(e, t) {
		var files = t.find('input[type=file]').files; // FileList object
		var uploadDefault = function (err, fileObj) {
			if (!err) {
		        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
		        var simulatorId = t.find('select :selected').value;
		        var object = Flint.collection('flintAssetObjects').findOne({
		        	containerId: Session.get('comp.flintAssetBrowser.selectedContainer'),
		        	simulatorId: {$exists: false},
		        });

		        // We have to do the following rigamarole since upserts are frowned upon
		        // on the client
		        if (object) {
		        	Flint.collection('flintAssetObjects').update(object._id,
		        	{
		        		objectId: fileObj._id
		        	});
		        } else {
		        	Flint.collection('flintAssetObjects').insert({
		        		containerId: Session.get('comp.flintAssetBrowser.selectedContainer'),
		        		objectId: fileObj._id
		        	});
		        }
		    } else {
		    	Flint.Log.error(err);
		    }
		};
		for (var i = 0, ln = files.length; i < ln; i++) {
			Flint.FS.collection('flintAssets').insert(files[i], uploadDefault);
		}
	},
	'click img': function(e, t) {
		$(e.target).toggleClass('enlarged');
	},
	'click .delete-object': function(e, t){
		debugger;
		var containerId = Session.get('comp.flintAssetBrowser.selectedContainer');
		Flint.collection('flintassetcontainers').remove({'_id' : containerId});
		Flint.collection('flintassetobjects').find({'containerId' : containerId}).forEach(function(e){
			Flint.collection('flintassetcontainers').remove({'_id': e._id});
		});
		Session.set('comp.flintAssetBrowser.selectedContainer',undefined);
	}
});