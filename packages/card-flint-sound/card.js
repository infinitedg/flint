Template.card_flint_sound.created = function(){
	window.addEventListener("keyup", function(e){
		Session.set('keyboard-currentKey',e.which);
		if (e.which == 65){
			Flint.play('/Sounds/Ping');
		}
	});
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('flint-macroSets');
	});
};
Template.card_flint_sound.helpers({
	'currentKey':function(){
		return Session.get('keyboard-currentKey');
	},
	'macroSets':function(){
		return Flint.collection('flintMacroSet').find();
	},
	'macroSetSelected':function(){
		if (this._id == Session.get('flint-sounds-selectedSet')){
			return 'selected';
		}
	}
});

Template.card_flint_sound.events({
	'click .addSet':function(){
		var setName = prompt('What is the name of the set?');
		Flint.collection('flintMacroSet').insert({name:setName});
	},
	'click .deleteSet':function(){
		Flint.collection('flintMacroSet').remove({'_id':Session.get('flint-sounds-selectedSet')});
	},
	'click .macroSetName':function(){
		Session.set('flint-sounds-selectedSet',this._id);
	}
});

Template.keyboard.events({
	'click #keyboard li':function(e,t){
		Session.set('soundKeyboard-selectedKey',e.target.dataset.which);
		if (e.target.dataset.which == 65){
			Flint.play('/Sounds/Ping');
		}
	}
});

Template.keyboard.helpers({
	'keySelected':function(e){
		if (Session.get('soundKeyboard-selectedKey') == e){
			return 'selected';
		}
	}
});
