var FlintCollections;
Template.card_flint_midi.helpers({
	midiData:function(){
		return Session.get('flint_midi_currentCommand');
	},
	currentChannel:function(){
		var doc = Flint.collection('flintMidiMappings').findOne({_id:Session.get('flint_midi_currentChannel')});
		if (doc){
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
	}
});

Template.card_flint_midi.created = function(){
	Flint.addComponent('comp_flint_midi');
	if (!FlintCollections) {
		FlintCollections = new Mongo.Collection("flintCollections");
	}
	Meteor.subscribe('flint-midi.collections');
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
	'change select':function(e){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var name = e.target.name;
		var value = e.target.value;
		var obj = {};
		obj[name] = value;
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:obj});
	},
	'change input[name="propertyPath"]':function(e){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var name = e.target.name;
		var value = e.target.value;
		var obj = {};
		obj[name] = value;
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:obj});
	},
	'change input[name="selector"]':function(e){
		var currentChannel = Session.get('flint_midi_currentChannel');
		var name = e.target.name;
		var value = JSON.parse(e.target.value);
		var obj = {};
		obj[name] = value;
		Flint.collection('flintMidiMappings').update({_id:currentChannel},{$set:obj});
	}
});
