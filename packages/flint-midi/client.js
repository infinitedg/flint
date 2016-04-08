var FlintCollections;
Template.card_flint_midi.helpers({
	midiData:function(){
		return Session.get('flint_midi_currentCommand');
	},
	currentChannel:function(){
		var doc = Flint.collection('flintMidiMappings').findOne({midiCommand:Session.get('flint_midi_currentCommand').command, midiNote:Session.get('flint_midi_currentCommand').note});
		if (doc){
			Session.set('flint_midi_currentChannel', doc._id);
			return doc;
		}
	},
	collections:function(){
		return FlintCollections.find();
	},
	selectorString:function(){
		return JSON.stringify(this.selector);
	},
	transform:function(){
		return Object.keys(Template.comp_flint_midi.midiTransform);
	},
	selectedTransform:function(){
		return (Template.parentData().transform == this.toString());
	},
	selectedCollection:function(){
		return (Template.parentData().collection == this.name.toString());
	}
});

Template.card_flint_midi.created = function(){
	Flint.addComponent('comp_flint_midi');
	if (!FlintCollections) {
		FlintCollections = new Mongo.Collection("flintCollections");
	}
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('flint-macroPresets');
		Meteor.subscribe('flint_macro_engine.macroNames');
		Meteor.subscribe('flint-midi.collections');
	});
};
Template.card_flint_midi.destroyed = function(){
	this.subscription.stop();
};
Template.card_flint_midi.events({
	'click .addMidiControl':function(){
		var data = Session.get('flint_midi_currentCommand');
		var obj = {
			midiCommand:data.command,
			midiNote:data.note,
		};
		obj.collection = null;
		obj.selector = {};
		obj.propertyPath = '';
		obj.transform = null;
		obj.simulatorId = Flint.simulatorId();
		_id = Flint.collection('flintMidiMappings').insert(obj);
		Session.set('flint_midi_currentChannel', _id);
	},
	'click .removeMidiControl':function(){
		var _id = Session.get('flint_midi_currentChannel');
		Session.set('flint_midi_currentChannel',null);
		Flint.collection('flintMidiMappings').remove({_id:_id});
	},
	'change select:not(.addMacro)':function(e){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var midiObject = Flint.collection('flintMidiMappings').findOne({_id:currentChannel});
		var name = e.target.name;
		var value = e.target.value;
		delete midiObject._id;
		for (var i = midiObject.operations.length - 1; i >= 0; i--){
			if (this.id === midiObject.operations[i].id)
			{
				midiObject.operations[i][name] = value;
			}
		}
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:midiObject});
	},
	'change input[name="propertyPath"]':function(e){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var midiObject = Flint.collection('flintMidiMappings').findOne({_id:currentChannel});
		var name = e.target.name;
		var value = (e.target.value);
		delete midiObject._id;
		for (var i = midiObject.operations.length - 1; i >= 0; i--){
			if (this.id === midiObject.operations[i].id)
			{
				midiObject.operations[i].propertyPath = value;
			}
		}
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:midiObject});
	},
	'change input[name="selector"]':function(e){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var midiObject = Flint.collection('flintMidiMappings').findOne({_id:currentChannel});
		var name = e.target.name;
		var value = JSON.parse(e.target.value);
		delete midiObject._id;
		for (var i = midiObject.operations.length - 1; i >= 0; i--){
			if (this.id === midiObject.operations[i].id)
			{
				midiObject.operations[i].selector = value;
			}
		}
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:midiObject});
	},
	'click .addOperation':function(){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var midiObject = Flint.collection('flintMidiMappings').findOne({_id:currentChannel});
		delete midiObject._id;
		var obj = {
			transform:'scaleTo255',
			collection:null,
			selector:{},
			propertyPath:'',
			id:Random.id()
		};
		if (typeof midiObject.operations !== 'object'){
			midiObject.operations = [obj]
		} else {
			midiObject.operations.push(obj);
		}
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:midiObject});
	},
	'click .removeOperation':function(){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var midiObject = Flint.collection('flintMidiMappings').findOne({_id:currentChannel});
		delete midiObject._id;
		for (var i = midiObject.operations.length - 1; i >= 0; i--){
			if (this.id === midiObject.operations[i].id)
			{
				midiObject.operations.splice(i,1);
			}
		}
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:midiObject});

	}
});
