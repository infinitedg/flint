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
	objects: [
		{
			simulatorId: Simulator this applies to
				// If nonexistent, this is the default object
			url: The URL in question
		}
	]
}
*/
Template.comp_flintassetbrowser.assets = function() {
	var sel = {};
	if (!Session.equals('comp.flintassetbrowser.currentDirectory', undefined)) {
		sel.parentObject = Session.get('comp.flintassetbrowser.currentDirectory');
	}
	return Flint.collection('flintAssets').find(sel);
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
	Deps.autorun(function(){
		this.assetSubscription = Meteor.subscribe("flint.assets", Session.get('comp.flintassetbrowser.currentDirectory'));
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
				basePath: parent.fullPath
			};
			if (!Session.equals('comp.flintassetbrowser.currentDirectory', undefined)) {
				obj.parentObject = Session.get('comp.flintassetbrowser.currentDirectory');
			}
			Flint.collection('flintAssets').insert(obj);
		}
	}
});