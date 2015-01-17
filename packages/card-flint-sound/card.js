Template.card_flint_sound.created = function(){
	Session.set('soundKeyboard-selectedModifiers',{
		'meta':false,
		'alt':false,
		'shift':false,
		'control':false
	})
	window.addEventListener("keydown", function(e){
		e.preventDefault();
		if (e.which == 191){
			Meteor.call('cancelRepeating',Flint.simulatorId());
		} else {
			var modifiers = {meta: e.metaKey, alt: e.altKey, shift: e.shiftKey, control: e.ctrlKey};
			Flint.collection('flintMacroKeys').find({'key':e.which.toString(), 'set':Session.get('flint-macros-selectedSet')}).forEach(function(macroKey){
				if (JSON.stringify(macroKey.modifiers) == JSON.stringify(modifiers)){
					Flint.collection('flintMacroPresets').find({'key':macroKey._id}).forEach(function(doc){
						doc.arguments.soundGroups = ['preview'];
						if (!doc.simulatorId) {
							doc.arguments.simulatorId = Flint.simulatorId();
						}
						Flint.macro(doc.name,doc.arguments);
					});
				}
			});
		}

	});
	window.addEventListener("keyup", function(e){
		e.preventDefault();
	});
	window.addEventListener("keypress", function(e){
		e.preventDefault();
	});
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('flint-macroSets');
		Meteor.subscribe('flint-macroKeys');
		Meteor.subscribe('flint-macroPresets');
		Meteor.subscribe('flint_macro_engine.macroNames');
	});
};

Template.card_flint_sound.destroyed = function() {
	this.subscription.stop();
};

Template.card_flint_sound.helpers({
	'currentKey':function(){
		return Session.get('soundKeyboard-selectedKey');
	},
	'macroSets':function(){
		return Flint.collection('flintMacroSets').find();
	},
	'macroSetSelected':function(){
		if (this._id == Session.get('flint-macros-selectedSet')){
			return 'selected';
		}
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
	'macroAssigned': function() {
		var output;
		Flint.collection('flintMacroKeys').find({'key':Session.get('soundKeyboard-selectedKey'),'set':Session.get('flint-macros-selectedSet')}).forEach(function(doc){
			if (JSON.stringify(doc.modifiers) == JSON.stringify(Session.get('soundKeyboard-selectedModifiers'))){
				output = Flint.collection('flintMacroPresets').find({'key':doc._id});
			}
		});
		return output;
	},
	'macroAssignedSelected':function(){
		if (this._id == Session.get('flint-macros-currentMacro')._id){
			return 'selected';
		}
	}
});
Template.card_flint_sound.events({
	'click .addSet':function(){
		var setName = prompt('What is the name of the set?');
		Flint.collection('flintMacroSets').insert({'name':setName});
	},
	'click .deleteSet':function(){
		Flint.collection('flintMacroSets').remove({'_id':Session.get('flint-macros-selectedSet')});
	},
	'click .macroSetName':function(){
		Session.set('flint-macros-selectedSet',this._id);
		Session.get('soundKeyboard-selectedKey',null);
		Session.set('flint-macros-currentMacro',null);
	},
	'click .macroAssignedName':function(){
		var macro = Flint.collection('flintMacroPresets').findOne({'_id':this._id});
		Session.set('flint-macros-currentMacro',macro);
	},
	'change .addMacro':function(e){
		var obj;
		Flint.collection('flintMacroKeys').find(
			{'key':Session.get('soundKeyboard-selectedKey'),'set':Session.get('flint-macros-selectedSet')}).forEach(function(doc){
				if (JSON.stringify(doc.modifiers) == JSON.stringify(Session.get('soundKeyboard-selectedModifiers'))){
					obj = doc;
				}
			});
			if (obj == undefined){
				obj = {
					_id: undefined,
					set: Session.get('flint-macros-selectedSet'),
					key: Session.get('soundKeyboard-selectedKey'),
					modifiers:Session.get('soundKeyboard-selectedModifiers'),
				}
			}
			var keyId = Flint.collection('flintMacroKeys').upsert({'_id':obj._id},obj);
			if (keyId.insertedId == undefined){
				keyId = obj._id;
			} else {
				keyId = keyId.insertedId;
			}
			var macroData = {
				'key': keyId,
				'name':e.target.value,
				'arguments':{}
			}
			macroId = Flint.collection('flintMacroPresets').insert(macroData);

			//Session.set('flint-macros-currentMacro',macroData);
			$('.addMacroLabel').removeAttr('selected');
			$('.addMacroLabel').attr('selected','true');
		},
		'click .deleteMacro':function(){

		}
	})
Template.keyboard.events({
	'click #keyboard li:not(.modify):not(.cancel)':function(e,t){
		Session.set('soundKeyboard-selectedKey',e.target.dataset.which);
		Session.set('flint-macros-currentMacro',null);
	},
	'click #keyboard li.modify':function(e,t){
		var obj = Session.get('soundKeyboard-selectedModifiers') || {
			'meta':false,
			'alt':false,
			'shift':false,
			'control':false
		};
		if (e.target.dataset.which == '16'){ //shift
			if (obj.shift)
				obj.shift = false;
			else
				obj.shift = true;
		}
		if (e.target.dataset.which == '17'){ //control
			if (obj.control)
				obj.control = false;
			else
				obj.control = true;
		}
		if (e.target.dataset.which == '18'){ //alt
			if (obj.alt)
				obj.alt = false;
			else
				obj.alt = true;
		}
		if (e.target.dataset.which == '91' || e.target.dataset.which == '93'){ //meta
			if (obj.meta)
				obj.meta = false;
			else
				obj.meta = true;
		}
		Session.set('soundKeyboard-selectedModifiers',obj);
		Session.set('flint-macros-currentMacro',null);
	}
})
Template.keyboard.helpers({
	'keySelected':function(e){
		if (Session.get('soundKeyboard-selectedKey') == e){
			return 'selected';
		} else {
			if (Flint.collection('flintMacroKeys').findOne(
				{'key':e,'set':Session.get('flint-macros-selectedSet'), 'modifiers':Session.get('soundKeyboard-selectedModifiers')}) != undefined){
				return 'assigned';
		}
	}

},
'modifySelected':function(e){
	var obj = Session.get('soundKeyboard-selectedModifiers') || {
		'meta':false,
		'alt':false,
		'shift':false,
		'control':false
	};
		if (e == '16'){ //shift
			if (obj.shift)
				return 'selected';
		}
		if (e == '17'){ //control
			if (obj.control)
				return 'selected';
		}
		if (e == '18'){ //alt
			if (obj.alt)
				return 'selected';
		}
		if (e == '91' || e == '93'){ //meta
			if (obj.meta)
				return 'selected';
		}
	}
})
