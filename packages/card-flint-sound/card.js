Template.card_flint_soundPlayer.created = function(){
		Flint.collection('flintSoundPlayers').insert({playerId: Flint.clientId(),simulatorId:Flint.simulatorId(),groupNames:['main']});
}
Template.card_flint_sound.created = function(){
	Flint.collection('flintSoundPlayers').insert({playerId: Flint.clientId(),simulatorId:Flint.simulatorId(),groupNames:['preview']});
	Session.setDefault('flint-macros-selectedSet',localStorage.getItem('flint-macros-selectedSet'));
	Session.setDefault('soundKeyboard-capsKey',false);
	Session.set('soundKeyboard-selectedModifiers',{
		'meta':false,
		'alt':false,
		'shift':false,
		'control':false,
		'caps':false
	})
	window.addEventListener("keydown", function(e){
		var focusElement = $(':focus')[0];
		if (focusElement != undefined){
		} else {
			if (e.which == '20')
				Session.set('soundKeyboard-capsKey',!Session.get('soundKeyboard-capsKey'));
			e.preventDefault();
			var modifiers = {meta: e.metaKey, alt: e.altKey, shift: e.shiftKey, control: e.ctrlKey, caps:Session.get('soundKeyboard-capsKey')};
			Flint.collection('flintMacroKeys').find({'key':e.which.toString(), 'set':Session.get('flint-macros-selectedSet')}).forEach(function(macroKey){
				if (JSON.stringify(macroKey.modifiers) == JSON.stringify(modifiers)){
					Flint.collection('flintMacroPresets').find({'key':macroKey._id}).forEach(function(doc){
						doc.arguments.soundGroups = ['preview'];
						var keyPressed = false;
						var removeKeys = [];
						if (doc.arguments.looping){
							if (typeof Flint.station("savedKeys") == "object"){
								for (keysPressed in Flint.station("savedKeys")){
									var e = Flint.station("savedKeys")[keysPressed];
									if (e.key == macroKey.key && JSON.stringify(e.modifiers) == JSON.stringify(macroKey.modifiers))
										keyPressed = true;
									removeKeys.push(keysPressed);
								}
							}
							if (keyPressed){
								var savedKeys = Flint.station("savedKeys");
								removeKeys.forEach(function(e){
									savedKeys.splice(e,1);
								});
								Flint.station('savedKeys',savedKeys);
								doc.arguments.cancelMacro = true;
							}
							var savedKey = {key: macroKey.key, modifiers:macroKey.modifiers};
							doc.arguments.keyPressed = savedKey;
							if (!keyPressed){
								var keys = Flint.station("savedKeys") || [];
								keys.push(savedKey);
								Flint.station("savedKeys",keys);
							}
						}
						if (!doc.simulatorId) {
							doc.arguments.simulatorId = Flint.simulatorId();
						}
						if (!doc.stationId){
							doc.arguments.stationId = Flint.station('_id');
						}
						console.log(doc,modifiers,macroKey);
						Flint.macro(doc.name,doc.arguments);
					});
}
});
}

});
window.addEventListener("keyup", function(e){
	var focusElement = $(':focus')[0];
	if (focusElement != undefined){
	} else {
		e.preventDefault();
	}
});
window.addEventListener("keypress", function(e){
	var focusElement = $(':focus')[0];
	if (focusElement != undefined){
	} else {
		e.preventDefault();
	}
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

Template.card_flint_sound.rendered = function(){
	window.focus();
}
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
		if (this._id && Session.get('flint-macros-currentMacro')){
			if (this._id == Session.get('flint-macros-currentMacro')._id){
				return 'selected';
			}
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
		localStorage.setItem('flint-macros-selectedSet',this._id);
		Session.get('soundKeyboard-selectedKey',null);
		Session.set('flint-macros-currentMacro',null);
	},
	'click .macroAssignedName':function(){
		var macro = Flint.collection('flintMacroPresets').findOne({'_id':this._id});
		Session.set('flint-macros-currentMacro',macro);
	},
	'click .deleteMacro':function(){
		if (Session.get('flint-macros-currentMacro')){
			_id = Session.get('flint-macros-currentMacro')._id;
			bootbox.confirm('Are you sure you want to delete that macro?', function(result){
				if (result){
					Flint.collection('flintMacroPresets').remove({_id:_id});
					_id = Flint.collection('flintMacroKeys').findOne({key:_id})._id;
					Session.set('flint-macros-currentMacro',null);
					Flint.collection('flintMacroKeys').remove({_id:_id});
				}
				bootbox.hideAll();
			})
		}
	},
	'change .addMacro':function(e){
		var obj;
		Flint.collection('flintMacroKeys').find({'key':Session.get('soundKeyboard-selectedKey'),'set':Session.get('flint-macros-selectedSet')}).forEach(function(doc){
			if (JSON.stringify(doc.modifiers) == JSON.stringify(Session.get('soundKeyboard-selectedModifiers'))){
				obj = doc;
			}
		});
		if (obj == undefined){
			obj = {
				_id: undefined,
				set: Session.get('flint-macros-selectedSet'),
				key: Session.get('soundKeyboard-selectedKey'),
				hidkey: Session.get('soundKeyboard-selectedHidKey'),
				modifiers:Session.get('soundKeyboard-selectedModifiers'),
			}
		}
		var keyId = Flint.collection('flintMacroKeys').upsert({'_id':obj._id},obj);
		if (typeof keyId == 'undefined'|| !keyId.insertedId){
			keyId = obj._id;
		} else {
			keyId = keyId.insertedId;
		}
		var macroData = {
			'key': keyId,
			'name':e.target.value,
			'arguments':{}
		}
		macroId = Flint.collection('flintMacroPresets').insert(macroData,function(err,_id){
			Session.set('flint-macros-currentMacro',Flint.collection('flintMacroPresets').findOne({_id:_id}));
		});

		$('.addMacroLabel').removeAttr('selected');
		$('.addMacroLabel').attr('selected','true');
	},
	'click .ambianceTracks':function(){
		Session.set('flint-macros-currentMacro', {name:'flint_ambiance'});
	}
});
Template.keyboard.events({
	'click #keyboard li:not(.modify)':function(e,t){
		Session.set('soundKeyboard-selectedKey',e.target.dataset.which);
		Session.set('soundKeyboard-selectedHidKey',e.target.dataset.hidkey);
		Session.set('flint-macros-currentMacro',null);
	},
	'click #keyboard li.modify':function(e,t){
		var obj = Session.get('soundKeyboard-selectedModifiers') || {
			'meta':false,
			'alt':false,
			'shift':false,
			'control':false,
			'caps':false
		};
		if (e.target.dataset.which == '20'){ //Caps
			if (obj.caps)
				obj.caps = false;
			else
				obj.caps = true;
		} 
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
});

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
'capsKey':function(){
	if (Session.get('soundKeyboard-capsKey')){
		return 'capsDown';
	}
},
'modifySelected':function(e){
	var obj = Session.get('soundKeyboard-selectedModifiers') || {
		'meta':false,
		'alt':false,
		'shift':false,
		'control':false,
		'caps':false
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
		if (e == '20'){ //caps
			if (obj.caps)
				return 'selected';
		}
	}
});
