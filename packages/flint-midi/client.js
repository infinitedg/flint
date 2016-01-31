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
	'availableMacros':function(){
		return Flint.collection('flintMacroDefinitions').find();
	},
	'configTemplate':function(){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro != undefined){
			return 'macro_' + macro.name;
		} else {
			return null;
		}
	},
	'configArguments':function(){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro != undefined){
			return macro.arguments;
		} else {
			return null;
		}
	},
	channelType:function(type){
		if (type === this.type){
			return true;
		}
		return false;
	},
	selectedMacro:function(){
		if (JSON.stringify(this) === JSON.stringify(Session.get('flint-macros-currentMacro'))){
			return 'selected';
		}
	},
	macros:function(){
		if (this.macros){
			return this.macros.map(function(e){
				return Flint.collection('flintMacroPresets').findOne(e.id);
			});
		}
	},
	macroArgument:function(){
		var macro = Session.get('flint-macros-currentMacro');
		var midiChannel = Flint.collection('flintMidiMappings').findOne({midiCommand:Session.get('flint_midi_currentCommand').command, midiNote:Session.get('flint_midi_currentCommand').note});
		var _id = macro._id;
		var macros = midiChannel.macros;
		macros.forEach(function(e){
			if (e.id === _id){
				$('[name="macroArgument"]').val(e.argument);
				return e.argument;
			}
		});
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
	},
	'change input[name="macroArgument"]':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		var midiChannel = Flint.collection('flintMidiMappings').findOne({_id:Session.get('flint_midi_currentChannel')});
		var _id = macro._id;
		var macros = midiChannel.macros;
		for (i = 0; i < macros.length; i++){
			if (macros[i].id === _id){
				macros[i].argument = e.target.value;
			}
		}
		Flint.collection('flintMidiMappings').update({_id:midiChannel._id},{$set:{macros:macros}});
	},
	'change .addMacro':function(e){
		var currentChannel = Flint.collection('flintMidiMappings').findOne(Session.get('flint_midi_currentChannel'));
		var channelId = currentChannel._id;
		var macroData = {
			'name':e.target.value,
			'arguments':{}
		};
		delete currentChannel._id;
		macroId = Flint.collection('flintMacroPresets').insert(macroData,function(err,_id){
			Session.set('flint-macros-currentMacro',Flint.collection('flintMacroPresets').findOne({_id:_id}));
			if (typeof currentChannel.macros === 'undefined'){
				currentChannel.macros = [{id:_id,argument:''}];
			} else {
				currentChannel.macros.push({id:_id,argument:''});
			}
			Flint.collection('flintMidiMappings').update({_id:channelId},currentChannel);
		});
		
		$('.addMacroLabel').removeAttr('selected');
		$('.addMacroLabel').attr('selected','true');
	},
	'click .macro':function(){
		Session.set('flint-macros-currentMacro',this);
	}
});
