Template.card_flint_sound.created = function(){
	window.addEventListener("keyup", function(e){
		debugger;
		e.preventDefault();
		var macroKeys = Flint.collection('flintMacroKeys').findOne({'keyNum':e.which.toString()});
		macroKeys.macros.forEach(function(id){
			var macro = Flint.collection('flintMacroPresets').findOne({'_id':id});
			Flint.macro(macro.name,macro.arguments);
		});
	});
	window.addEventListener("keydown", function(e){
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
		var keyCollection = Flint.collection('flintMacroKeys').findOne(
			{'keyNum':Session.get('soundKeyboard-selectedKey'),'set':Session.get('flint-macros-selectedSet')});
		if (keyCollection != undefined){
			return keyCollection.macros || [];
		} else {
			return null;
		}
	},
	'assignedMacroName':function(){
		return Flint.collection('flintMacroPresets').findOne({'_id':this.concat()}).name;
	},
	'macroAssignedSelected':function(){
		if (this.concat() == Session.get('flint-macros-currentMacro')._id){
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
	},
	'click .macroAssignedName':function(){
		var macro = Flint.collection('flintMacroPresets').findOne({'_id':this.concat()});
		Session.set('flint-macros-currentMacro',macro);
	},
	'change .addMacro':function(e){
		var obj = Flint.collection('flintMacroKeys').findOne(
			{'keyNum':Session.get('soundKeyboard-selectedKey'),'set':Session.get('flint-macros-selectedSet')});
		if (obj == undefined){
			obj = {
				_id: undefined,
				set: Session.get('flint-macros-selectedSet'),
				keyNum: Session.get('soundKeyboard-selectedKey'),
				modifiers:Session.get('soundKeyboard-selectedModifiers'),
				macros: []
			}
		}
		var macroData = {
			'name':e.target.value,
			'arguments':{}
		}
		macroId = Flint.collection('flintMacroPresets').insert(macroData);
		obj.macros.push(macroId);
		Flint.collection('flintMacroKeys').upsert({'_id':obj._id},obj)
		Session.set('flint-macros-currentMacro',macroData);
		$('.addMacroLabel').removeAttr('selected');
		$('.addMacroLabel').attr('selected','true');
	},
	'click .deleteMacro':function(){

	}
})
Template.keyboard.events({
	'click #keyboard li:not(.modify)':function(e,t){
		Session.set('soundKeyboard-selectedKey',e.target.dataset.which);
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
	}
})
Template.keyboard.helpers({
	'keySelected':function(e){
		if (Session.get('soundKeyboard-selectedKey') == e){
			return 'selected';
		} else {
			if (Flint.collection('flintMacroKeys').findOne(
				{'keyNum':e,'set':Session.get('flint-macros-selectedSet')}) != undefined){
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
